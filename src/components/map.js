import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMapReady } from '../actions/index'
import OLLI_STOPS from '../data/stops.json'
import OLLI_ROUTE from '../data/route.json'
import POIS from '../data/pois.json'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

let Map = class Map extends React.Component {
  map;

  static propTypes = {
    olliPosition: PropTypes.object,
    olliRouteVisibility: PropTypes.string.isRequired
  };

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
      cs = positionObj.coordinates.coordinates;
    }
    data.features[0].geometry.coordinates = [cs[0], cs[1]];
    this.map.getSource('olli-bus').setData(data);
  }

  updatePOICategory(category) {
    category = category.toLowerCase();
    let showpois = {"type":"FeatureCollection","features":[]};
    if (! category) {
      console.log('POI Category is null.');
    }
    else {
      POIS.features.forEach(poi => {
        poi.properties.category.forEach(cat => {
          if (cat.term === category) {
            showpois.features.push(poi);
          }
        }, this);
      }, this);
      // console.log(`POI Category is ${category}. Do something with it...`);
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
      this.map.getSource('olli-pois').setData(showpois);
      this.map.setLayoutProperty('olli-pois', 'visibility', 'visible');
    }
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
  }

  componentDidUpdate() {
  }

  loadImage(imagename, imageid) {
    this.map.loadImage('/img/'+imagename, (error, image) => {
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
      center: [-92.466, 44.022],
      zoom: 16
    });

    let imagenames = ['olli-icon-svg.png', 'olli-stop-color.png', 'noun_1012350_cc.png', 'noun_854071_cc.png', 'noun_1015675_cc.png'];
    let imageids = ['olli', 'olli-stop', 'restaurant-noun', 'medical-noun', 'museum-noun'];
    for (var idx = 0; idx < imagenames.length; idx++) {
      this.loadImage(imagenames[idx], imageids[idx]);
    }

    this.map.on('load', () => {
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
          'text-offset': [0, 2],
          'text-field': '{label}'
        }
      });
      this.props.setMapReady(true);
    });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="bx--col-xs-8" />
    );
  }
}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition,
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility,
    poiCategory: state.poiCategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setMapReady: setMapReady
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
