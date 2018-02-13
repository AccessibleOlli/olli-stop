import React from 'react'
import mapboxgl from 'mapbox-gl'
// import axios from 'axios';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMapReady, setDestination, setPOIs } from '../actions/index'
import POISearch from '../util/poi_search'
import OLLI_STOPS from '../data/stops.json'
import POIS from '../data/pois.json'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
const CENTER_LON = -92.466;
const CENTER_LAT = 44.0214;
const audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
// const MSG_NEAR_MEDICAL = 'Your destination is near a medical facility. If you need to go to one of these places after, I can give you directions.';

let Map = class Map extends React.Component {
  map;
  warningpopup;

  constructor(props) {
    super(props);
    this.poiSearch = new POISearch();
    this.state = {
      destinationStopName: null
    };
  }

  //All arguments are optional:
  //duration of the tone in milliseconds. Default is 500
  //frequency of the tone in hertz. default is 440
  //volume of the tone. Default is 1, off is 0.
  //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
  //callback to use on end of tone
  beep(duration, frequency, volume, type, callback) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume){gainNode.gain.value = volume;};
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}

    oscillator.start();
    setTimeout(function(){oscillator.stop()}, (duration ? duration : 500));
  };

  converse(text) {
    return this.poiSearch.searchPOIs(text)
      .catch(err => {
        console.log(err);
      });
  }
  
  initPOIs(pois) {
    if (pois) {
      pois.forEach((poi) => {
        poi.selected = false;
      });
    }
    return pois;
  }

  getRestaurantPOIs(stop) {
    return this.converse(`show me restaurants near ${stop}`)
      .then((pois) => {
        return this.initPOIs(pois);
      });
  }

  getPharmacyPOIs(stop) {
    return this.converse(`show me hospitals near ${stop}`)
      .then((pois) => {
        return this.initPOIs(pois);
      });
  }

  findStopFeatureByName(stopname) {
    for (let i=0; i<OLLI_STOPS.features.length; i++) {
      let stop = OLLI_STOPS.features[i];
      if (stop.properties.name.toString().toLowerCase() === stopname.toLowerCase()) {
        return stop;
      }
    }
    return false;
  }

  clearDestination() {
    this.map.setLayoutProperty('olli-destination', 'visibility', 'none');
    this.props.setPOIs(null);
  }

  setNewDestination(stopname) {
    let stop = this.findStopFeatureByName(stopname);
    if (stop) {
      let dest = this.map.getSource('olli-destination');
      // if same as before, toggle it off
      if (dest._data && dest._data.properties.name === stop.properties.name) {
        this.clearDestination();
      }
      // set destination
      this.map.getSource('olli-destination').setData(stop);
      // load pois
      let pois = [];
      this.getRestaurantPOIs(stopname)
        .then((restaurantPOIs) => {
          if (restaurantPOIs && restaurantPOIs.length > 0) {
            pois = pois.concat(restaurantPOIs);
          }
          return this.getPharmacyPOIs(stopname);
        })
        .then((pharmacyPOIs) => {
          if (pharmacyPOIs && pharmacyPOIs.length > 0) {
            pois = pois.concat(pharmacyPOIs);
          }
          this.props.setPOIs(pois);  
        });
    }
  }

  updateMapBounds(coordinates) {
    const initalBounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord)
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    this.map.fitBounds(initalBounds, {
      padding: 100
    });
  }

  updateOlliRouteVisibility(visibility) {
    this.map.setLayoutProperty('olli-route', 'visibility', visibility);
  }

  calculatePosition(fromPosition, toPosition, progress) {
    const lat1 = fromPosition[1];
    const long1 = fromPosition[0];
    const lat2 = toPosition[1];
    const long2 = toPosition[0];
    return [lat1 + (lat2 - lat1) * progress, long1 + (long2 - long1) * progress].reverse();
  }

  // Support multiple ollis (without smoothing)
  updateOlliPositionsAoSimNoSmooth(positions) {
    for (let position of positions) {
      let coordinates = [position.coordinates[0], position.coordinates[1]];
      const data = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': coordinates
          }
        }]
      };
      let layerId = `olli-bus-${position.olliId}`;
      let layer = this.map.getSource(layerId);
      if (layer) {
        layer.setData(data);
      }
      else {
        this.map.addLayer({
          'id': layerId,
          'source': {
            'type': 'geojson',
            'data': data
          },
          'type': 'symbol',
          'layout': {
            'icon-image': 'olli',
            'icon-size': 0.75
          }
        });
      }
    }
  }

  // Support multiple ollis
  updateOlliPositionsAOSim(positions) {
    let firstPosition = false;
    if (! this.olliPositions) {
      firstPosition = true;
      this.olliPositions = {};
      this.olliPositionTimes = {};
    }
    for (let position of positions) {
      if (! position.processed) {
        position.processed = true;
        let olliId = position.olliId;
        let coordinates = [position.coordinates[0], position.coordinates[1]];
        if (! (olliId in this.olliPositions)) {
          this.olliPositions[olliId] = [];
          this.olliPositionTimes[olliId] = [];
        }
        this.olliPositions[olliId].push(coordinates);
        this.olliPositionTimes[olliId].push(new Date().getTime());
      }
    }
    if (firstPosition) {
      requestAnimationFrame(this.animateOlliPositions.bind(this));
    }
  }

  animateOlliPositions(timestamp) {
    Object.keys(this.olliPositions).forEach((key) => {
      this.animateOlliPositionsForOlli(key, timestamp);
    });
    requestAnimationFrame(this.animateOlliPositions.bind(this));
  }

  animateOlliPositionsForOlli(olliId, timestamp) {
    if (this.olliPositions[olliId].length > 1) {
      // map the time the position was recorded (in updateOlliPosition) to the
      // animation timestamp (passed into this function)
      // the very first time map it to the current animation timestamp
      // this is the baseline
      if (! this.olliPositionTimestamps) {
        this.olliPositionTimestamps = {};
      }
      if (! (olliId in this.olliPositionTimestamps)) {
        this.olliPositionTimestamps[olliId] = [];
        this.olliPositionTimestamps[olliId].push(timestamp);
      }
      // anytime a subsequent position has been recorded (in updateOlliPosition)
      // we map to an animation timestamp. the value is set to the animation timestamp
      // for the position recorded right before this one plus the duration between positions
      // (the time from the previous recorded position to the next recorded position)
      for(let i=1; i<this.olliPositionTimes[olliId].length; i++) {
        if (this.olliPositionTimestamps[olliId].length < (i+1)) {
          let d = (this.olliPositionTimes[olliId][i] - this.olliPositionTimes[olliId][i-1]);
          this.olliPositionTimestamps[olliId].push(this.olliPositionTimestamps[olliId][i-1] + d);
        }
      }
      // calculate the progress between the first and second stops in our list
      let progress = (timestamp - this.olliPositionTimestamps[olliId][0])/(this.olliPositionTimestamps[olliId][1] - this.olliPositionTimestamps[olliId][0]);
      // if the progress is >= 1 that means we have reached our destination (or enough time has elapsed from the last animation)
      // if that's the case we pop of the first position and then start at the next position
      if (progress >= 1) {
        this.olliPositions[olliId].splice(0, 1);
        this.olliPositionTimes[olliId].splice(0, 1);
        this.olliPositionTimestamps[olliId].splice(0, 1);
      }
      else {
        // if progress is < 1 then we calculate the position between the two based on the progress
        let fromPosition = this.olliPositions[olliId][0];
        let toPosition = this.olliPositions[olliId][1];
        let position = fromPosition;
        if (progress > 0) {
          position = this.calculatePosition(fromPosition, toPosition, progress);
        }
        const data = {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': []
            }
          }]
        };
        data.features[0].geometry.coordinates = position;
        // update the map
        let layerId = `olli-bus-${olliId}`;
        let layer = this.map.getSource(layerId);
        if (layer) {
          layer.setData(data);
        }
        else {
          this.map.addLayer({
            'id': layerId,
            'source': {
              'type': 'geojson',
              'data': data
            },
            'type': 'symbol',
            'paint': {
              'text-color': '#046b99',
              'text-halo-color': "#fff",
              'text-halo-width': 4, 
              'text-halo-blur': 1
            },
            'layout': {
              'icon-image': 'olli',
              'icon-size': 0.75,
              'text-font': ["Open Sans Semibold","Open Sans Regular","Arial Unicode MS Regular"],
              'text-field': `${olliId}`,
              'text-size': 12, 
              'text-offset': [0, 3]
            }
          });
        }
      }
    }
  }

  // Support single olli
  // USE THIS WITH OLLI-SIM
  updateOlliPositionForOlliSim(positionObj) {
    let cs = null;
    if (positionObj.position) {
      cs = positionObj.position.coordinates;
    }
    else {
      cs = positionObj.coordinates;
    }
    let coordinates = [cs[0], cs[1]];
    if (! this.olliPositions) {
      this.olliPositions = [];
      this.olliPositionTimes = [];
      this.totalOlliPositions = 1;
    }
    else {
      this.totalOlliPositions++;
    }
    // here we ignore duplicate positions for the very 1st position recorded
    // this is a hack because the first two positions we get are when the olli stops
    // and there is a large gap in those positions
    // the very first gap dictates the lag for the rest of the session
    // here we minimize the lag by waiting until there are two different positions
    // and resetting the time for the first position
    // const l = this.olliPositions.length;
    if (this.totalOlliPositions === 2 && this.olliPositions[0][0] === coordinates[0] && this.olliPositions[0][1] === coordinates[1]) {
      this.totalOlliPositions = 1;
      this.olliPositionTimes[0] = new Date().getTime();
    }
    else {
      this.olliPositions.push(coordinates);
      this.olliPositionTimes.push(new Date().getTime());
    }
    if (this.totalOlliPositions === 2) {
      // start animating on the 2nd position recorded
      requestAnimationFrame(this.animateOlliPosition.bind(this));
    }
  }

  animateOlliPosition(timestamp) {
    if (this.olliPositions.length > 1) {
      // map the time the position was recorded (in updateOlliPosition) to the
      // animation timestamp (passed into this function)
      // the very first time map it to the current animation timestamp
      // this is the baseline
      if (! this.olliPositionTimestamps) {
        this.olliPositionTimestamps = [];
        this.olliPositionTimestamps.push(timestamp);
      }
      // anytime a subsequent position has been recorded (in updateOlliPosition)
      // we map to an animation timestamp. the value is set to the animation timestamp
      // for the position recorded right before this one plus the duration between positions
      // (the time from the previous recorded position to the next recorded position)
      for(let i=1; i<this.olliPositionTimes.length; i++) {
        if (this.olliPositionTimestamps.length < (i+1)) {
          let d = (this.olliPositionTimes[i] - this.olliPositionTimes[i-1]);
          this.olliPositionTimestamps.push(this.olliPositionTimestamps[i-1] + d);
        }
      }
      // calculate the progress between the first and second stops in our list
      let progress = (timestamp - this.olliPositionTimestamps[0])/(this.olliPositionTimestamps[1] - this.olliPositionTimestamps[0]);
      // if the progress is >= 1 that means we have reached our destination (or enough time has elapsed from the last animation)
      // if that's the case we pop of the first position and then start at the next position
      if (progress >= 1) {
        this.olliPositions.splice(0, 1);
        this.olliPositionTimes.splice(0, 1);
        this.olliPositionTimestamps.splice(0, 1);
      }
      else {
        // if progress is < 1 then we calculate the position between the two based on the progress
        let fromPosition = this.olliPositions[0];
        let toPosition = this.olliPositions[1];
        let position = fromPosition;
        if (progress > 0) {
          position = this.calculatePosition(fromPosition, toPosition, progress);
        }
        const data = {
          'type': 'FeatureCollection',
          'features': [{
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': []
            }
          }]
        };
        data.features[0].geometry.coordinates = position;
        // update the map
        let layerId = 'olli-bus';
        let layer = this.map.getSource(layerId);
        if (layer) {
          layer.setData(data);
        }
        else {
          this.map.addLayer({
            'id': layerId,
            'source': {
              'type': 'geojson',
              'data': null
            },
            'type': 'symbol',
            'layout': {
              'icon-image': 'olli',
              'icon-size': 0.75
            }
          });
        }
      }
    }
    requestAnimationFrame(this.animateOlliPosition.bind(this));
  }

  // THIS IS ALL MOCKUP. REPLACE WITH WATSON ASSISTANT YELP SKILL
  /*
  getNearbyPOIs(stopfeature) {
    // quick hack to give a relevant message to those near a medical center
    if ( ['Mayo Guggenheim', 'Mayo Gonda', 'Peace Plaza'].includes(stopfeature.properties.name)) {
      this.props.mapMessage({__html: "<h2>&#8220;"+MSG_NEAR_MEDICAL+"&#8221;<h2>"}, []);
    }
    this.map.setLayoutProperty('olli-pois', 'visibility', 'visible');
  }*/

  updatePOIs(pois) {
    if (! pois) {
      pois = [];
    }
    let showpois = {"type":"FeatureCollection","features":[]};
    pois.forEach(p => {
      let poi = {
        type: 'Feature',
        _id: p.id,
        properties: {
          name: p.name,
          label: [{value: p.name}],
          image_url: p.image_url
        },
        geometry: {
          type: 'Point',
          coordinates: [p.coordinates.longitude, p.coordinates.latitude]
        }
      };
      showpois.features.push(poi);
    });
    this.map.getSource('olli-pois').setData(showpois);
    this.map.setLayoutProperty('olli-pois', 'visibility', 'visible');
  }

  updatePOICategory(category) {
    let showpois = POIS;
    if (category) {
      let categories = [category.toLowerCase()];
      if ( categories[0] === 'attractions' ) 
        categories = categories.concat(['arts', 'publicservicesgovt']);
      showpois = {"type":"FeatureCollection","features":[]};
      POIS.features.forEach(poi => {
        poi.properties.category.forEach(cat => {
          if ( categories.includes(cat.term) ) {
            showpois.features.push(poi);
          }
        }, this);
      }, this);
      switch (category) {
        case 'food':
          this.map.setLayoutProperty('olli-pois', 'icon-image', 'restaurant-noun');
          break;
        case 'health':
          this.map.setLayoutProperty('olli-pois', 'icon-image', 'medical-noun');
          break;
        default: 
          this.map.setLayoutProperty('olli-pois', 'icon-image', 'circle-15');
      }
    }
    this.map.getSource('olli-pois').setData(showpois);
    this.map.setLayoutProperty('olli-pois', 'visibility', 'visible');
}

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona !== this.props.activePersona) {
      let resizeMap = (
        (this.props.activePersona && ! nextProps.activePersona) ||
        (! this.props.activePersona && nextProps.activePersona)
      );
      if (resizeMap) {
        setTimeout(() => {this.map.resize()}, 1);
      }
    }
    if (nextProps.olliRoute !== this.props.olliRoute) {
      const coordinates = nextProps.olliRoute.coordinates.map(coord => {
        return [coord.coordinates[0], coord.coordinates[1]];
      });
      this.updateMapBounds(coordinates);
      //this.map.getSource('olli-route').setData(nextProps.olliRoute);
      // this.updateOlliRoute(coordinates);
    }
    if (nextProps.olliRouteVisibility !== this.props.olliRouteVisibility) {
      this.updateOlliRouteVisibility(nextProps.olliRouteVisibility);
    }
    // olli-sim/single olli support
    if (nextProps.olliPosition !== this.props.olliPosition) {
      this.updateOlliPositionOlliSim(nextProps.olliPosition);
    }
    // ao_sim/multiple olli support
    if (nextProps.olliPositions !== this.props.olliPositions) {
      this.updateOlliPositionsAOSim(nextProps.olliPositions);
    }
    if (nextProps.poiCategory !== this.props.poiCategory) {
      this.updatePOICategory(nextProps.poiCategory);
    }
    if (nextProps.destinationStopName == null) {
      this.clearDestination();
    }
    if (nextProps.destinationStopName && nextProps.destinationStopName !== this.props.destinationStopName) {
        this.setNewDestination(nextProps.destinationStopName);
    }
    if (nextProps.pois !== this.props.pois) {
      this.updatePOIs(nextProps.pois);
    }
  }

  loadImage(imagename, imageid) {
    this.map.loadImage('./img/'+imagename, (error, image) => {
      if (error) {
        throw error
      } else {
        this.map.addImage(imageid, image);
      }
    });
  }

  handleMapClick(evt) {
      // let bbox = [[evt.point.x-5, evt.point.y-5], [evt.point.x+5, evt.point.y+5]]; // set bbox as 5px rectangle area around clicked point
      // let features = this.map.queryRenderedFeatures(bbox, {layers: ['olli-pois']});
      // if (!features.length) {
      //   return;
      // }
      // let feature = features[0];
      // console.log(feature);
      // let popup = new mapboxgl.Popup({ offset: [0, -15] })
      //   .setLngLat(feature.geometry.coordinates)
      //   .setHTML('<h3>' + feature.properties.name + '</h3><p><img src="' + feature.properties.image_url + '" style="height: 40px;"></p>')
      //   .setLngLat(feature.geometry.coordinates)
      //   .addTo(this.map);
      
      if (this.warningpopup) this.warningpopup.remove();
        
      let bbox = [[evt.point.x-5, evt.point.y-5], [evt.point.x+5, evt.point.y+5]]; // set bbox as 5px rectangle area around clicked point
      let features = this.map.queryRenderedFeatures(bbox, {layers: ['olli-stops']});
      let dest = this.map.getSource('olli-destination');

      if (features.length<1) {
        this.beep(300, 300);
        this.warningpopup = new mapboxgl.Popup({closeButton: false})
          .setLngLat([CENTER_LON, CENTER_LAT])
          .setHTML('Please press on a bus stop')
          .addTo(this.map);
        return;
      }

      // if a destination is already set and we have a clicked feature
      if (this.props.destinationStopName) {
        // if clicked stop is same as previous, un-set the destination
        if (this.props.destinationStopName === features[0].properties.name) {
          this.props.setDestination(null);
          this.map.setLayoutProperty('olli-destination', 'visibility', 'none');
          // dest.setData({'type': 'Feature', 'geometry': {'type':'Point', 'coordinates':[0,0]}});
        } else { // not same as previous
          this.props.setDestination(features[0].properties.name);
          dest.setData(features[0]);
          this.map.setLayoutProperty('olli-destination', 'visibility', 'visible');
        }
      
      // if no destination is set
      } else {
        this.props.setDestination(features[0].properties.name);
        dest.setData(features[0]);
        this.map.setLayoutProperty('olli-destination', 'visibility', 'visible');
        // this.getNearbyPOIs(features[0]);
      }

    }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: "mapContainer",
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [CENTER_LON, CENTER_LAT], 
      zoom: 16
    });

    let imagenames = ['olli-icon-svg.png', 'olli-stop-color.png', 'noun_1012350_cc.png', 'noun_854071_cc.png', 'noun_1015675_cc.png', 'youarehere.png','yourdest.png','poi_marker.png'];
    let imageids = ['olli', 'olli-stop', 'restaurant-noun', 'medical-noun', 'museum-noun', 'youarehere','yourdest', 'poi-marker'];
    for (var idx = 0; idx < imagenames.length; idx++) {
      this.loadImage(imagenames[idx], imageids[idx]);
    }
    
    this.map.on('click', this.handleMapClick.bind(this));

    this.map.on('load', () => {
      this.map.dragRotate.disable();// disable map rotation using right click + drag
      this.map.touchZoomRotate.disableRotation();// disable map rotation using touch rotation gesture
      this.addBasicMapLayers();
      this.props.setMapReady(true);
      this.map.resize();
    });
  }

  addBasicMapLayers() {
    // add route layer
    console.log("in addBasicMapLayers")
    let routeGeoJson = this.props.olliRoute;
    if (routeGeoJson.type !== 'FeatureCollection') {
      routeGeoJson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeGeoJson.coordinates
          }
        }]
      };
    }
    this.map.addLayer({
      'id': 'olli-route',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': routeGeoJson
      },
      'layout': {
        'line-cap': 'round',
        'line-join': 'round',
        'visibility': this.props.olliRouteVisibility
      },
      'paint': {
        'line-color': '#0087bd',
        'line-width': 10,
        'line-opacity': 0.4
      }
    });

    this.map.addLayer({
      'id': 'olli-stops-w3w',
      'source': {
        'type': 'geojson',
        'data': OLLI_STOPS
      },
      'type': 'symbol',
      'paint': {
        'text-color': "#444444",
        'text-halo-color': "#fff", //"#0087bd",
        'text-halo-width': 4, 
        'text-halo-blur': 1
      },
      'layout': {
        'icon-image': 'olli-stop',
        'icon-optional': true,
        'icon-size': 0.15, 
        'text-font': ["Open Sans Semibold","Open Sans Regular","Arial Unicode MS Regular"],
        'text-field': '{what3words}', 
        'text-size': 12, 
        'text-offset': [6, 0]
      }
    });
    this.map.addLayer({
      'id': 'olli-stops',
      'source': {
        'type': 'geojson',
        'data': OLLI_STOPS
      },
      'type': 'symbol',
      'paint': {
        'text-halo-color': "#fff", //"#0087bd",
        'text-halo-width': 4, 
        'text-halo-blur': 1
      },
      'layout': {
        'icon-image': 'olli-stop',
        'icon-size': 0.35, 
        'icon-ignore-placement': true,
        'text-font': ["Open Sans Semibold","Open Sans Regular","Arial Unicode MS Regular"],
        'text-field': '{name}', 
        'text-size': 14, 
        'text-offset': [0, -2]
      }
    });
    this.map.addLayer({
      'id': 'olli-current-stop',
      'source': {
        'type': 'geojson',
        'data': this.props.stop
      },
      'type': 'symbol',
      'layout': {
        'icon-image': 'youarehere',
        'icon-size': 0.35,
        'icon-anchor': 'top',  
        'icon-offset': [-212, 0]
      }
    });
    // destination -- set by user click
    this.map.addLayer({
      'id': 'olli-destination',
      'source': {
        'type': 'geojson',
        'data': null
      },
      'type': 'symbol',
      'layout': {
        'icon-image': 'yourdest',
        'icon-size': 0.35,
        'icon-anchor': 'top',  
        'icon-offset': [-212, 0]
      }
    });
    this.map.addLayer({
      'id': 'olli-pois',
      'source': {
        'type': 'geojson',
        'data': POIS
      },
      'type': 'symbol',
      'paint': {
        'text-color': '#444444',
        'text-halo-color': "#fff",
        'text-halo-width': 4, 
        'text-halo-blur': 1,
        'icon-halo-color': "#fff",
        'icon-halo-width': 4, 
        'icon-halo-blur': 1
      },
      'layout': {
        'visibility': 'none',
        'icon-image': 'poi-marker',
        'icon-size': 0.5, 
        'text-font': ["Open Sans Semibold","Open Sans Regular","Arial Unicode MS Regular"],
        'text-size': 12, 
        'text-offset': [0, 2],
        'text-field': '{name}'
      }
    });
  }

  render() {
    return (
      <div id="mapContainer" />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setMapReady: setMapReady, 
    // mapMessage: mapMessage, 
    setPOIs: setPOIs,
    setDestination: setDestination
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona,
    olliPositions: state.olliPositions,
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility,
    poiCategory: state.poiCategory,
    destinationStopName: state.destinationStopName,
    pois: state.pois
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
