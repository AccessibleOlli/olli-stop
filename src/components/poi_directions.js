import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sendDirectionsSMS from '../util/sms_directions';

class POIDirections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directionsSent: false
    }
  }

  text() {
    sendDirectionsSMS(this.props.poiDirections, this.props.activePersona);
    this.setState({directionsSent:true});
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
    let sentMessage = <td>
      <button className="text-directions-button" onClick={(e) => this.text()}>
        <img src="./img/iphone.png" />Send to Phone
      </button>
    </td>;

    if (this.state.directionsSent) {
      sentMessage = <td><h2>Directions sent to your phone!</h2></td>
      // this.setState({directionsSent:false});
    }

    return (
      <div className="directions">
        <table style={{width: '100%'}}>
          <tbody>
          <tr>
            <td style={{textAlign: 'right'}}>directions provided by <img className="mapbox-logo" src="./img/mapbox-logo-color.svg" /> </td>  
          </tr>
          <tr>
            {sentMessage}
          </tr>
          </tbody>
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