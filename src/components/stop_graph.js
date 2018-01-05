import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDestination } from '../actions/index'
import DISPLAY_STOPS from '../data/display_stops.json'

class StopGraph extends Component {

  onStopClick(itm) {
    if (this.props.destinationStopName === itm.target.name) {
      // disable for now - causing issues
      //this.props.setDestination(null);
    }
    else {
      this.props.setDestination(itm.target.name);
    }
  }

  render() {
    let stopImageRows = DISPLAY_STOPS.map((stop, idx) => {
      let input = undefined;
      if (stop.disabled) {
        input = <input type="image" className="stop-btn-img" src="./img/olli-stop.png" alt="stop"  disabled/>;
      }
      else {
        let className = "stop-btn-img";
        if (this.props.destinationStopName === stop.name) {
          className += " selected";
        }
        input = <input type="image" className={className} src="./img/olli-stop-color.png" alt="stop" name={stop.name} onClick={this.onStopClick.bind(this)} />
      }
      return (
        <td key={idx} className="stop-btn">
          {input}
        </td>
      );
    });
    let stopLabelRows = DISPLAY_STOPS.map((stop, idx) => {
      return (
        <td key={idx} className="stop-btn" style={{whiteSpace: 'pre-line'}}>
          {stop.label}
        </td>
      );
    });
    let className = 'stop-graph-hidden';
    if (this.props.activePersona) {
      let cognitivePersonaOnly = (
        this.props.activePersonaTypes.cognitive &&
        ! this.props.activePersonaTypes.deaf &&
        ! this.props.activePersonaTypes.blind &&
        ! this.props.activePersonaTypes.wheelchair
      );
      if (! cognitivePersonaOnly) {
        className = 'stop-graph';
      }
    }
    return (
      <div className={className}>
        <h2>Click a stop to set your destination</h2>
        <table id="stop-btn-table" style={{backgroundImage: 'url(img/stop-dot.png)', backgroundRepeat: 'repeat-x'}}>
          <tbody>
            <tr>
              {stopImageRows}
            </tr>
            <tr>
              {stopLabelRows}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona,
    activePersonaTypes: state.activePersonaTypes,
    destinationStopName: state.destinationStopName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDestination: setDestination
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StopGraph);