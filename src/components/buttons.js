import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOlliRouteVisibility } from '../actions/index'

class Buttons extends Component {

  toggleRoute(hide) {
    if (hide) {
      this.props.setOlliRouteVisibility('none');
    }
    else {
      this.props.setOlliRouteVisibility('visible');
    }
  }

  render() {
    let hide = false;
    let text = 'Show';
    if (this.props.olliRouteVisibility === 'visible') {
      hide = true;
      text = 'Hide';
    }
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
    setOlliRouteVisibility: setOlliRouteVisibility
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);