import React, { Component } from 'react';

class POISelectedListItem extends Component {

  render() {
    return(
      <div>
        {this.props.poi.name} |
        <a onClick={(e) => this.props.onShowDirections(this.props.poi)}>Directions</a> |
        <a onClick={(e) => this.props.onRemove(this.props.poi)}>Remove</a>
      </div>
    );
  }
}

export default POISelectedListItem;