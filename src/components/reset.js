import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDestination } from '../actions/index';

class Reset extends Component {
  reset() {
    this.props.setDestination(null);
  }

  render() {
    if (this.props.destinationStopName)
      return (
        <button className="reset-button" onClick={e=>this.reset()}>Reset</button>
      )
    return (<div/>)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDestination: setDestination
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    destinationStopName: state.destinationStopName
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
