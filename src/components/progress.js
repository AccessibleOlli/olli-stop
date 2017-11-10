import React, { Component } from 'react';
import { connect } from 'react-redux';

class Progress extends Component {

  constructor() {
    super();
    this.stopIndex = 0;
  }
  render() {
    if (! this.props.olliPosition) {
      return <div />;
    }
    else {
      let stop1String = '';
      let stop2String = '';
      if (this.props.olliPosition.currentStop) {
        stop1String = `ARRIVED: ${this.props.olliPosition.currentStop.name}`;
      }
      else if (this.props.olliPosition.previousStop) {
        stop1String = `PREVIOUS: ${this.props.olliPosition.previousStop.name}`;
      }
      if (this.props.olliPosition.nextStop) {
        stop2String += `NEXT: ${this.props.olliPosition.nextStop.name}`;
      }
      let coords = `${(this.props.olliPosition.coordinates[0]+" ").slice(0,6)}, ${(this.props.olliPosition.coordinates[1]+" ").slice(0,6)}`;
      return (
        <div style={{margin: 10}} className="absolute bottom right">
          <h3>Coords: {coords}</h3>
          <h3>{stop1String}</h3>
          <h3>{stop2String}</h3>
          <h3>progress: {Math.round(this.props.olliPosition.nextStopProgress * 100)}%</h3>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition
  };
}

export default connect(mapStateToProps)(Progress);