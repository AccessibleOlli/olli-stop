import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class POIDirections extends Component {

  render() {
    let directions = undefined;
    if (this.props.poiDirections) {
      directions = (
        <div>
          {this.props.poiDirections.poi.name}
        </div>
      )
    }
    return (
      <div>
        {directions}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    poiDirections: state.poiDirections
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    //
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POIDirections);