import React, { Component } from 'react';
import { connect } from 'react-redux';

class Progress extends Component {

  constructor() {
    super();
    this.stopIndex = 0;
  }
  render() {
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
    let coords = `${this.props.olliPosition.coordinates[0]}, ${this.props.olliPosition.coordinates[1]}`;
    return (
      <div style={{margin: 10}} className="absolute top right">
        <h3>{coords}</h3>
        <h3>{stop1String}</h3>
        <h3>{stop2String}</h3>
        <h3>{this.props.olliPosition.nextStopProgress}</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition
  };
}

export default connect(mapStateToProps)(Progress);