import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Map from './map';

class MapWrapper extends Component {

  render() {
    if (this.props.activePersona) {
      return (
        <div id="mapWrapper1" className="mapboxgl-map-normal">
          <Map stop={this.props.stop} />
        </div>
      );
    }
    else {
      return (
        <div id="mapWrapper2" className="mapboxgl-map-full">
          <Map stop={this.props.stop} />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // 
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);