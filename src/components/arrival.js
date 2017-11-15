import React, { Component } from 'react';
import { connect } from 'react-redux';

class Arrival extends Component {
    render() {
        return (
            <div className="stop-panel">
                <h2>Arriving</h2>
                <div className="clock">4 minutes{this.props.arrivaltime}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        arrivaltime: state.arrivaltime
    };
  }
  
export default connect(mapStateToProps)(Arrival);
