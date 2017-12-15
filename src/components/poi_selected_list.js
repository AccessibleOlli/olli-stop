import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deselectPOI, setPOIDirections } from '../actions/index'

class POISelectedList extends Component {

  showDirections(poi) {
    this.props.setPOIDirections({
      poi: poi,
      directions: {}
    })
  }

  deselectPOI(poi) {
    this.props.deselectPOI(poi);
  }

  render() {
    let selectedPOIs = [];
    if (this.props.selectedPOIs) {
      this.props.selectedPOIs.forEach((poi) => {
        selectedPOIs.push(
          <div>
            {poi.name} |
            <a onClick={(e) => this.showDirections(poi)}>Directions</a> |
            <a onClick={(e) => this.deselectPOI(poi)}>Remove</a>
          </div>
        )
      });
    }
    return (
      <div>
        {selectedPOIs}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedPOIs: state.selectedPOIs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deselectPOI: deselectPOI,
    setPOIDirections: setPOIDirections
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POISelectedList);