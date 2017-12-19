import React, { Component } from 'react';

class POIListItem extends Component {

  render() {
    return (
      <div>
        <a onClick={(e) => this.props.onSelect(this.props.poi)}>{this.props.poi.name}</a>
        <img src={this.props.poi.image_url} alt={this.props.poi.name} style={{height: "50px"}} />
      </div>
    );
  }
}

export default POIListItem;