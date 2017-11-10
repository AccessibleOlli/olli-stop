import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMapReady } from '../actions/index'
import OLLI_STOPS from '../data/stops.json'
import OLLI_ROUTE from '../data/route.json'

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

  // updateOlliRoute(coordinates) {
  //   const data = {
  //     'type': 'FeatureCollection',
  //     'features': [{
  //       'type': 'Feature',
  //       'geometry': {
  //         'type': 'LineString',
  //         'coordinates': coordinates
  //       }
  //     }]
  //   };
  //   this.map.getSource('olli-route').setData(data);
  // }

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
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-92.466, 44.022],
      zoom: 16
    });
    this.map.loadImage('/img/olli-icon-svg.png', (error, image) => {
      if (error) {
        throw error
      }
      else {
        this.map.addImage('olli', image)
      }
    });
    this.map.loadImage('/img/olli-stop-color.png', (error, image) => {
      if (error) {
        throw error
      }
      else {
        this.map.addImage('olli-stop', image)
      }
    });
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
      this.props.setMapReady(true);
    });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    );
  }
}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition,
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setMapReady: setMapReady
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
