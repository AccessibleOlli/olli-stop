import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { connect } from 'react-redux'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

let Map = class Map extends React.Component {
  map;

  static propTypes = {
    olliPosition: PropTypes.object.isRequired,
    olliRoute: PropTypes.object.isRequired,
    olliRouteVisibility: PropTypes.string.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.olliRouteVisibility !== this.props.olliRouteVisibility) {
      this.map.setLayoutProperty('olli-route', 'visibility', nextProps.olliRouteVisibility);
    }
    if (nextProps.olliPosition !== this.props.olliPosition) {
      this.map.getSource('olli-bus').setData(nextProps.olliPosition);
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
      this.map.fitBounds(this.props.mapBounds, {
        padding: 100
      });
      // add route layer
      this.map.addLayer({
        'id': 'olli-route',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': this.props.olliRoute
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
      this.map.addLayer({
        'id': 'olli-bus',
        'source': {
          'type': 'geojson',
          'data': this.props.olliPosition
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
    mapBounds: state.mapBounds,
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility,
    olliPosition: state.olliPosition
  };
}

export default connect(mapStateToProps)(Map);
