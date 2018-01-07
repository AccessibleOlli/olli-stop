import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

let TEXT_PERSONA_IF_SET = process.env['REACT_APP_TEXT_PERSONA_IF_SET'];
if (TEXT_PERSONA_IF_SET && TEXT_PERSONA_IF_SET.toLowerCase() === 'false') {
  TEXT_PERSONA_IF_SET = false;
}
const TEXT_PHONE_NUMBER = process.env['REACT_APP_TEXT_PHONE_NUMBER']; 

class POIDirections extends Component {

  text() {
    let phone = TEXT_PHONE_NUMBER;
    if (TEXT_PERSONA_IF_SET && this.props.activePersona.preferences && this.props.activePersona.preferences.mobile_phone) {
      phone = this.props.activePersona.preferences.mobile_phone;
    }
    if (! phone) {
      return;
    }
    phone = phone.replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '');
    if (! phone.startsWith('+')) {
      if (! phone.startsWith('1')) {
        phone = '1' + phone;
      }
      phone = '+' + phone;
    }
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
      <div className="directions">
        <table style={{width: '100%'}}>
          <tr>
          <td>
            <button className="text-directions-button" onClick={(e) => this.text()}>
              <img src="./img/iphone.png" />
              Send to Phone
            </button>
          </td>
          <td style={{textAlign: 'right'}}>directions provided by <img className="mapbox-logo" src="./img/mapbox-logo-color.svg" /> </td>  
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
    activePersona: state.activePersona,
    poiDirections: state.poiDirections
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    //
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POIDirections);