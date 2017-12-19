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
      return (<div className = "pois-nearby-empty"></div>);
    }
    
    let poipics = null;
    poipics = this.props.pois.map((poi, index) => {
      let poistate = "deselected";
      if (poi.selected) poistate = "selected";
      let states = "poi-image "+poistate;
      return <img key={index} className={states} src={poi.image_url} title={poi.name} alt={poi.name} onClick={(e)=>this.onPOIClick(poi)} />;
    });

    return (
      <div className = "pois-nearby">
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
    pois: state.pois
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(POISNearby);
