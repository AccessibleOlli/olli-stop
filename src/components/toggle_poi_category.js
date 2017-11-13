import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPOICategory } from '../actions/index'

class TogglePOICategory extends Component {

  selectCategory(category) {
    if (category === this.props.poiCategory) {
      this.props.setPOICategory(null);
    }
    else {
      this.props.setPOICategory(category);
    }
  }

  renderButton(category) {
    let style = {};
    if (category === this.props.poiCategory) {
      style = { backgroundColor: '#FF0000' };
    }
    return <button className='button' style={style} onClick={() => this.selectCategory(category)}>{category}</button>
  }

  render() {
    return (
      <div>
        {this.renderButton('Health')}
        {this.renderButton('Food')}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    poiCategory: state.poiCategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setPOICategory: setPOICategory
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TogglePOICategory);