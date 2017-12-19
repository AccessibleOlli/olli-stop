import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPOI } from '../actions/index'
import POIListItem from './poi_list_item';

class POIList extends Component {

  selectPOI(poi) {
    this.props.selectPOI(poi);
  }

  render() {
    let pois = [];
    if (this.props.pois) {
      this.props.pois.forEach((poi) => {
        pois.push(
          <POIListItem poi={poi} key={poi.id} onSelect={(poi) => this.selectPOI(poi)} />
        );
      })
    }
    return (
      <div>
        {pois}
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