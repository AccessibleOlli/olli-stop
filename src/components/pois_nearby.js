import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPOI, deselectPOI } from '../actions/index';

class POISNearby extends Component {
  onPOIClick(poiclicked) {
    if (poiclicked.selected) 
      this.props.deselectPOI(poiclicked);
    else 
      this.props.selectPOI(poiclicked);
  }
  
  render() {
    if (!this.props.pois) {
      return (<div className = "pois-nearby-hidden"></div>);
    }
    
    let poipics = null;
    poipics = this.props.pois.map((poi, index) => {
      let poistate = "deselected";
      if (poi.selected) poistate = "selected";
      let states = "poi-image "+poistate;
      return (
        <div key={index} className="poi-nearby">
          <img className={states} src={poi.image_url} title={poi.name} alt={poi.name} onClick={(e)=>this.onPOIClick(poi)} />
          <div className="poi-image-title">{poi.name}</div>
        </div>
      );
    });

    let className = 'pois-nearby-hidden';
    if (this.props.activePersona) {
      let cognitivePersonaOnly = (
        this.props.activePersonaTypes.cognitive &&
        ! this.props.activePersonaTypes.deaf &&
        ! this.props.activePersonaTypes.blind &&
        ! this.props.activePersonaTypes.wheelchair
      );
      if (! cognitivePersonaOnly) {
        className = 'pois-nearby';
      }
    }
    return (
      <div className={className}>
        <h2>POIs near my destination</h2>
        <div className="poi-images">
          <div>{poipics}</div>
        </div>
      </div>
    );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectPOI: selectPOI,
    deselectPOI: deselectPOI
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona,
    activePersonaTypes: state.activePersonaTypes,
    pois: state.pois
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(POISNearby);
