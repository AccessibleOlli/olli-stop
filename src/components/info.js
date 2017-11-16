import React, { Component } from 'react';
import { connect } from 'react-redux';

class Info extends Component {
    render() {
        return (
            <div>{this.props.info}</div>
        );
    }
}

function mapStateToProps(state) {
    return {
      info: state.info
    };
  }
  
export default connect(mapStateToProps)(Info);
