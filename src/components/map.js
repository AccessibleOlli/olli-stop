import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'
import route from '../route';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

let Map = class Map extends React.Component {
  map;

  static propTypes = {
    olliPosition: PropTypes.object.isRequired,
    olliRouteVisibility: PropTypes.string.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.olliRouteVisibility !== this.props.olliRouteVisibility) {
      this.map.setLayoutProperty('olli-route', 'visibility', nextProps.olliRouteVisibility);
    }
    if (nextProps.olliPosition !== this.props.olliPosition) {
      const data = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': nextProps.olliPosition.coordinates
          }
        }]
      };
      this.map.getSource('olli-bus').setData(data);
    }
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-97.380979, 42.877742],
      zoom: 4
    });
    this.map.loadImage('/img/olli-icon-svg.png', (error, image) => {
      if (error) {
        throw error
      }
      else {
        this.map.addImage('olli', image)
      }
    });
    this.map.loadImage('/img/olli-stop.png', (error, image) => {
      if (error) {
        throw error
      }
      else {
        this.map.addImage('olli-stop', image)
      }
    });
    this.map.on('load', () => {
      // set bounds
      const coordinates = route.points.map(point => {
        return point.coordinates;
      });
      console.log(coordinates);
      const initalBounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord)
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      this.map.fitBounds(initalBounds, {
        padding: 100
      });
      // add route layer
      let initalRoute = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }]
      };
      this.map.addLayer({
        'id': 'olli-route',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': initalRoute
        },
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
          'visibility': this.props.olliRouteVisibility
        },
        'paint': {
          'line-color': '#888888',
          'line-width': 8,
          'line-opacity': 0.6
        }
      });
      // add olli position layer
      const data = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': this.props.olliPosition.coordinates
          }
        }]
      };
      this.map.addLayer({
        'id': 'olli-bus',
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
    olliRouteVisibility: state.olliRouteVisibility,
    olliPosition: state.olliPosition
  };
}

export default connect(mapStateToProps)(Map);
