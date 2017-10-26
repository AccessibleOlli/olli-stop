import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOlliPosition, setOlliRouteVisibility } from '../actions/index'
import route from '../route'

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
    if (this.routeIndex < route.points.length) {
      this.props.setOlliPosition(route.points[this.routeIndex]);
      let timeout = 500;
      if (route.points[this.routeIndex].currentStop) {
        timeout = 2500;
      }
      setTimeout(() => this.drive(), timeout);
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
      <div style={{margin: 10}} className="absolute top left pill">
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