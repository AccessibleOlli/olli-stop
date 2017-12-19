import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import axios from 'axios';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMapReady } from '../actions/index'
import { mapMessage } from '../actions/index'
import { setDestination, setPOIs } from '../actions/index'
import OLLI_STOPS from '../data/stops.json'
import OLLI_ROUTE from '../data/route.json'
import POIS from '../data/pois.json'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
const CENTER_LON = -92.466;
const CENTER_LAT = 44.0214;
const audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
const MSG_NEAR_MEDICAL = 'Your destination is near a medical facility. If you need to go to one of these places after, I can give you directions.';

let Map = class Map extends React.Component {
  map;
  warningpopup;

  static propTypes = {
    olliPosition: PropTypes.object,
    olliRouteVisibility: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      stopSelected: false
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
    console.log('User/Button: ' + text);
    var data = {
      text: text,
      skipTTS: true
    };
    return axios({
      method: 'POST',
      url: '/api/conversation/converse',
      data: data
    })
      .then((converationResponse) => {
        let pois = [];
        if (converationResponse.data.card) {
          pois = converationResponse.data.card.content;
        }
        this.props.setPOIs(pois);
        console.log('Olli: ' + converationResponse.data.response);
      }).catch(err => {
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
    var foundstop = false;
    for (let i=0; i<OLLI_STOPS.features.length; i++) {
      let stop = OLLI_STOPS.features[i];
      if (stop.properties.name.toString().toLowerCase() === stopname.toLowerCase()) {
        return stop;
      }
    }
    return false;
  }

  setNewDestination(stopname) {
    let stop = this.findStopFeatureByName(stopname);
    if (stop) {
      let dest = this.map.getSource('olli-destination');
      // if same as before, toggle it off
      if (dest._data && dest._data.properties.name === stop.properties.name) {
        dest.setData(null);
        this.props.setPOIs(null);
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

  updateOlliPosition(positionObj) {
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
    let cs = null;
    if (positionObj.position) {
      cs = positionObj.position.coordinates;
      // this.map.jumpTo({
      //   center: [cs[0], cs[1]]
        // bearing: positionObj.position.properties.heading
      // });
    } else {
      cs = positionObj.coordinates;
    }
    data.features[0].geometry.coordinates = [cs[0], cs[1]];
    this.map.getSource('olli-bus').setData(data);
  }

  // THIS IS ALL MOCKUP. REPLACE WITH WATSON ASSISTANT YELP SKILL
  getNearbyPOIs(stopfeature) {
    // quick hack to give a relevant message to those near a medical center
    if ( ['Mayo Guggenheim', 'Mayo Gonda', 'Peace Plaza'].includes(stopfeature.properties.name)) {
      this.props.mapMessage({__html: "<h2>&#8220;"+MSG_NEAR_MEDICAL+"&#8221;<h2>"}, []);
    }
    this.map.setLayoutProperty('olli-pois', 'visibility', 'visible');
}

  updatePOIs(pois) {
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
    if (nextProps.olliRoute !== this.props.olliRoute) {
      const coordinates = nextProps.olliRoute.coordinates.map(coord => {
        return [coord.coordinates[0], coord.coordinates[1]];
      });
      this.updateMapBounds(coordinates);
      // this.updateOlliRoute(coordinates);
    }
    if (nextProps.olliRouteVisibility !== this.props.olliRouteVisibility) {
      this.updateOlliRouteVisibility(nextProps.olliRouteVisibility);
    }
    if (nextProps.olliPosition !== this.props.olliPosition) {
      this.updateOlliPosition(nextProps.olliPosition);
    }
    if (nextProps.poiCategory !== this.props.poiCategory) {
      this.updatePOICategory(nextProps.poiCategory);
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

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [CENTER_LON, CENTER_LAT], 
      zoom: 16
    });

    let imagenames = ['olli-icon-svg.png', 'olli-stop-color.png', 'noun_1012350_cc.png', 'noun_854071_cc.png', 'noun_1015675_cc.png', 'youarehere.png','yourdest.png'];
    let imageids = ['olli', 'olli-stop', 'restaurant-noun', 'medical-noun', 'museum-noun', 'youarehere','yourdest'];
    for (var idx = 0; idx < imagenames.length; idx++) {
      this.loadImage(imagenames[idx], imageids[idx]);
    }
    
    this.map.on('click', evt => {
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

      if (dest._data && dest._data.properties && features.length>0) {
        if (dest._data.properties.name === features[0].properties.name) {
          // reset the destination stop and leave map in a clean state
          this.props.mapMessage({__html: "<h2>Welcome. Where would you like to go?</h2><p>Select a stop on the map.</p>"}, []);
          dest.setData({'type': 'Feature', 'geometry': {'type':'Point', 'coordinates':[0,0]}});
          return;
        } else {
          dest.setData(features[0]);
        }
      }

      let layerid = dest._data ? 'olli-pois' : 'olli-stops';
      features = this.map.queryRenderedFeatures(bbox, {layers: [layerid]});

      if (!dest._data || 
        !dest._data.properties) {
        if (features.length>0) {
          dest.setData(features[0]);
          // this.setState({destination: features[0], stopSelected: true});
          // this.getNearbyPOIs(features[0]);
        } else {
          this.beep(300, 300);
          var warningpopup = new mapboxgl.Popup({closeButton: false})
            .setLngLat([CENTER_LON, CENTER_LAT])
            .setHTML('Please press on a bus stop')
            .addTo(this.map);
        }
      } else {
        if (features.length>0) {
          // there's a stop selected, and the click has found some features from the POIs layer
          this.props.mapMessage({__html: "<h3>"+features[0].properties.name+"</h3>"});
        }
      }
    });

    this.map.on('load', () => {
      this.map.resize();
      this.addBasicMapLayers();
      this.props.setMapReady(true);
    });
  }

  addBasicMapLayers() {
      // add route layer
      this.map.addLayer({
        'id': 'olli-route',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': OLLI_ROUTE
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
        'id': 'olli-bus',
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
      this.map.addLayer({
        'id': 'olli-pois',
        'source': {
          'type': 'geojson',
          'data': POIS
        },
        'type': 'symbol',
        'paint': {
          'text-color': '#0087bd',
          'text-halo-color': "#fff",
          'text-halo-width': 4, 
          'text-halo-blur': 1,
          'icon-halo-color': "#fff",
          'icon-halo-width': 4, 
          'icon-halo-blur': 1
        },
        'layout': {
          'visibility': 'none',
          'icon-image': 'circle-15',
          'icon-size': 0.5, 
          'text-font': ["Open Sans Semibold","Open Sans Regular","Arial Unicode MS Regular"],
          'text-size': 12, 
          // 'text-offset': [0, 2],
          'text-field': '{name}'
        }
      });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} />
    );
  }
}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition,
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility,
    poiCategory: state.poiCategory,
    destinationStopName: state.destinationStopName,
    pois: state.pois
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setMapReady: setMapReady, 
    mapMessage: mapMessage, 
    setPOIs: setPOIs
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
