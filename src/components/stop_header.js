import React, { Component } from 'react';
import { connect } from 'react-redux';

class StopHeader extends Component {

  render() {
    let stopName = 'TBD';
    if (this.props.olliPosition) {
      if (this.props.olliPosition.currentStop) {
        stopName = this.props.olliPosition.currentStop.name;
      }
      else if (this.props.olliPosition.nextStop) {
        stopName = this.props.olliPosition.nextStop.name;
      }
    }
    return (
      <h1 className="stopname">{stopName}</h1>
    );
  }

}

function mapStateToProps(state) {
  return {
    olliPosition: state.olliPosition
  }
}

export default connect(mapStateToProps)(StopHeader);