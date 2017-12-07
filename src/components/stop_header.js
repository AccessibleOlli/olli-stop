import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class StopHeader extends Component {

  render() {
    let stopName = 'TBD';
    // console.log(this.props.stop);
    if (this.props.stop) {
      if (this.props.stop.properties) {
        stopName = this.props.stop.properties.name;
      }
      else if (this.props.stop.nextStop) {
        stopName = this.props.stop.nextStop.name;
      }
    }
    return (
      <h1 className="stopname">{stopName}</h1>
    );
  }

}

// function mapStateToProps(state) {
//   return {
//     olliPosition: state.olliPosition
//   }
// }

// export default connect(mapStateToProps)(StopHeader);