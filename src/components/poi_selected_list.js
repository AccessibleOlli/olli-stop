import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deselectPOI, setPOIDirections } from '../actions/index'
import POISelectedListItem from './poi_selected_list_item';
import axios from 'axios';
import getDirections from '../util/directions'

class POISelectedList extends Component {

  showDirections(poi) {
    getDirections(this.props.selectedPOIs)
    .then((directions) => {
      this.props.setPOIDirections(directions);
    });
  }

  deselectPOI(poi) {
    this.props.deselectPOI(poi);
  }

  render() {
    let selectedPOIs = [];
    if (this.props.selectedPOIs) {
      this.props.selectedPOIs.forEach((poi) => {
        selectedPOIs.push(
          <POISelectedListItem
            poi={poi}
            onShowDirections={(poi) => this.showDirections(poi)}
            onRemove={(poi) => this.deselectPOI(poi)}
          />
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