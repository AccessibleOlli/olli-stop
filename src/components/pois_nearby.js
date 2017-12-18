import React, {Component} from 'react';
import { connect } from 'react-redux';

class PoisNearby extends Component {
  render() {
    return (
      <div className = "pois-nearby">
        <h3> POIs near my destination</h3>
        <div className="poi-images">
          <img className="poi-image" src="./img/pic_placeholder.png" alt="placeholder poi img" />
          <img className="poi-image" src="./img/pic_placeholder.png" alt="placeholder poi img" />
          <img className="poi-image" src="./img/pic_placeholder.png" alt="placeholder poi img" />
          <img className="poi-image" src="./img/pic_placeholder.png" alt="placeholder poi img" />
          <img className="poi-image" src="./img/pic_placeholder.png" alt="placeholder poi img" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    arrivaltime: state.arrivaltime
  };
}

export default connect(mapStateToProps)(PoisNearby);