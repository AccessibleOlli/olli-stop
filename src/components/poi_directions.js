import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class POIDirections extends Component {

  text() {
    axios({
      method: 'POST',
      url: '/api/text',
      data: {
        phoneNumber: '+15127793970',
        text: this.props.poiDirections.directions.join('\n')
      }
    })
      .then((response) => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    let directions = undefined;
    if (this.props.poiDirections) {
      console.log(this.props.poiDirections);
      directions = (
        <div>
          {this.props.poiDirections.poi.name} | <a onClick={(e) => this.text()}>Text</a>
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