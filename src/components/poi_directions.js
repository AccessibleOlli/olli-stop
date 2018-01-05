import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

class POIDirections extends Component {

  text() {
    let phone = '+16172991557';
    let directions = [];
    if (this.props.poiDirections) {
      directions = this.props.poiDirections.legs.map((leg => {
        let steps = leg.steps.map((step) => {
          let iconClassName = "directions-icon";
          if (step.modifier) {
            iconClassName += " directions-icon-" + step.modifier;
          }
          return `* ${step.instruction} ${step.distance}m`;
        });
        return `DESTINATION: ${leg.poi.name}\n` + steps.join('\n');
      }));
    }
    if (directions.length > 0) {
      let text = directions.join('\n\n');
      axios({
        method: 'POST',
        url: '/api/text',
        data: {
          phoneNumber: phone,
          text: text
        }
      })
        .then((response) => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        });
      }
  }

  render() {
    let directions = [];
    if (this.props.poiDirections) {
      directions = this.props.poiDirections.legs.map((leg => {
        let steps = leg.steps.map((step) => {
          let iconClassName = "directions-icon";
          if (step.modifier) {
            iconClassName += " directions-icon-" + step.modifier;
          }
          return (
            <li className="mapbox-directions-step">
              <span className={iconClassName}></span>
              <div className="mapbox-directions-step-maneuver">
                {step.instruction}
              </div>
              <div className="mapbox-directions-step-distance">
                {step.distance}m
              </div>
            </li>
          );
        });
        return (
          <div>
            <div className="mapbox-directions-component mapbox-directions-route-summary mapbox-directions-multiple">
              <h1>{leg.poi.name}</h1>
            </div>
            <ol className="mapbox-directions-steps">
              {steps}
            </ol>
          </div>
        );
      }))
    }
    return (
      <div>
        <table style={{width: '100%'}}>
          <tr>
          <td><button className="text-directions-button" onClick={(e) => this.text()}>Send to Phone</button></td>
          <td style={{textAlign: 'right'}}>Directions provided by <img src="/images/mapbox-logo-black.png" style={{height: '20px', verticalAlign: 'middle'}} /></td>  
          </tr>
        </table>
        <div className="directions-control directions-control-directions">
          <div className="mapbox-directions-instructions">
            <div className="mapbox-directions-instructions-wrapper">
              {directions}
            </div>
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