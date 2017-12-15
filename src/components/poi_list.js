import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPOI } from '../actions/index'

class POIList extends Component {

  selectPOI(poi) {
    this.props.selectPOI(poi);
  }

  render() {
    let pois = [];
    if (this.props.pois) {
      this.props.pois.forEach((poi) => {
        pois.push(
          <div>
            <a onClick={(e) => this.selectPOI(poi)}>{poi.name}</a>
          </div>
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