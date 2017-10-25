import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOlliPosition, setOlliRouteVisibility } from '../actions/index'
import route from '../route.json'

const coordinates = route.features[0].geometry.coordinates.map(coords => {
  return [coords[0], coords[1]]
});

class Buttons extends Component {

  constructor() {
    super();
    this.driving = false;
    this.routeIndex = 0;
  }

  toggleRoute(hide) {
    if (hide) {
      this.props.setOlliRouteVisibility('none');
    }
    else {
      this.props.setOlliRouteVisibility('visible');
    }
  }

  driveRoute() {
    if (this.driving) {
      return;
    }
    this.routeIndex = -1;
    this.drive();
  }

  drive() {
    this.routeIndex = this.routeIndex + 1;
    if (this.routeIndex < coordinates.length) {
      let position = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': coordinates[this.routeIndex]
          }
        }]
      };
      this.props.setOlliPosition(position);
      setTimeout(() => this.drive(), 100);
    }
    else {
      this.driving = false;
    }
  }

  render() {
    let hide = false;
    let text = 'Show';
    if (this.props.olliRouteVisibility === 'visible') {
      hide = true;
      text = 'Hide';
    }
    return (
      <div style={{margin: 10}} className="absolute top left">
        <button className='button' onClick={() => this.toggleRoute(hide)}>{text} Route</button>
        <button className='button' onClick={() => this.driveRoute()}>Drive Route</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    olliRouteVisibility: state.olliRouteVisibility
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setOlliRouteVisibility: setOlliRouteVisibility,
    setOlliPosition: setOlliPosition
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);