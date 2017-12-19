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
    console.log('POI DIRECTIONSSSSSSS')
    let directions = [];
    if (this.props.poiDirections) {
      directions = this.props.poiDirections.legs.map((leg => {
        let steps = leg.steps.map((step) => {
          let iconClassName = "directions-icon";
          if (step.modifier) {
            iconClassName += " directions-icon-" + step.modifier;
          }
          return (
            <li class="mapbox-directions-step">
              <span className={iconClassName}></span>
              <div class="mapbox-directions-step-maneuver">
                {step.instruction}
              </div>
              <div class="mapbox-directions-step-distance">
                {step.distance}m
              </div>
            </li>
          );
        });
        return (
          <div>
            <div class="mapbox-directions-component mapbox-directions-route-summary mapbox-directions-multiple">
              <h1>{leg.poi.name}</h1>
            </div>
            <ol class="mapbox-directions-steps">
              {steps}
            </ol>
          </div>
        );
      }))
    }
    return (
      <div class="directions-control directions-control-directions">
        <div class="mapbox-directions-instructions">
          <div class="mapbox-directions-instructions-wrapper">
            {directions}
          </div>
        </div>
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