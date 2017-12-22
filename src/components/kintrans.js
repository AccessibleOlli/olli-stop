import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPOI } from '../actions/index'

class KinTrans extends Component {

  render() {
    
    return (
      <div>
        <Unity
            src='/kintrans/Build/WebGL.json'
            loader='/kintrans/Build/UnityLoader.js' />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pois: state.pois
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectPOI: selectPOI
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POIList);