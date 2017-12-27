import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDestination } from '../actions/index'

class StopGraph extends Component {

  constructor() {
    super();
    this.stops = [
      {
        name: 'Discovery Square',
        label: 'Discovery\nSquare',
        disabled: true
      },
      {
        name: 'Mayo Guggenheim',
        label: 'Mayo\nGuggenheim'
      },
      {
        name: 'Mayo Gonda',
        label: 'Mayo\nGonda'
      },
      {
        name: 'Peace Plaza',
        label: 'Peace\nPlaza'
      },
      {
        name: 'Restaurant District',
        label: 'Restaurant\nDistrict'
      }
    ];
  }

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
    let stopImageRows = this.stops.map((stop, idx) => {
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
    let stopLabelRows = this.stops.map((stop, idx) => {
      return (
        <td key={idx} className="stop-btn" style={{whiteSpace: 'pre-line'}}>
          {stop.label}
        </td>
      );      
    });
    return (
      <div className="stop-graph">
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
    destinationStopName: state.destinationStopName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDestination: setDestination
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StopGraph);