import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOlliPosition, setOlliRouteVisibility } from '../actions/index'

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
      this.driving = false;
    }
    else {
      this.driving = true;
      if (this.routeIndex <= 0 || this.routeIndex >= this.props.olliRoute.points.length) {
        this.routeIndex = -1;
      }
      this.drive();
    }
  }

  drive() {
    if (! this.driving) {
      return;
    }
    this.routeIndex = this.routeIndex + 1;
    if (this.routeIndex < this.props.olliRoute.points.length) {
      this.props.setOlliPosition(this.props.olliRoute.points[this.routeIndex].coordinates);
      let timeout = 10;
      if (this.props.olliRoute.points[this.routeIndex].currentStop) {
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
    console.log(this.props.olliRoute);
    if (! this.props.olliRoute) {
      return (
        <div style={{margin: 10}} className="absolute top left pill">
        </div>
      );
    }
    else {
      return (
        <div style={{margin: 10}} className="absolute top left pill">
          <button className='button' onClick={() => this.toggleRoute(hide)}>{text} Route</button>
          <button className='button' onClick={() => this.driveRoute()}>Drive Route</button>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setOlliPosition: setOlliPosition,
    setOlliRouteVisibility: setOlliRouteVisibility
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);