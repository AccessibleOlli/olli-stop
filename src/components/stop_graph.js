import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDestination } from '../actions/index'

class StopGraph extends Component {

  onStopClick(itm) {
    this.props.setDestination(itm.target.name);
  }

  render() {
    return (
      <div className="stop-graph">
        <div className="stop-dot-spacer">
        <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
          <span className="stop-dot">&#x25CF;</span>
        </div>
        <table id="stop-btn-table">
          <tbody>
            <tr>
              <td className="stop-btn"><input type="image" className="stop-btn-img" src="./img/olli-stop.png" alt="stop"  disabled/><br/>Discovery<br/>Square</td>
              {/* <td className="stop-dot-spacer"><span className="stop-dot">&#x25CF;</span><span className="stop-dot">&#x25CF;</span><span className="stop-dot">&#x25CF;</span><span className="stop-dot">&#x25CF;</span></td> */}
              <td className="stop-btn"><input type="image" className="stop-btn-img" src="./img/olli-stop-color.png" alt="stop" /><br/>Mayo<br/>Guggenheim</td>
              <td className="stop-btn">
                <input type="image" className="stop-btn-img" src="./img/olli-stop-color.png" alt="stop" name="Mayo Gonda" onClick={this.onStopClick.bind(this)} />
                <br/>Mayo<br/>Gonda
              </td>
              <td className="stop-btn">
                <input type="image" className="stop-btn-img" src="./img/olli-stop-color.png" alt="stop" name="Peace Plaza" onClick={this.onStopClick.bind(this)} />
                <br/>Peace<br/>Plaza
              </td>
              <td className="stop-btn"><input type="image" className="stop-btn-img" src="./img/olli-stop-color.png" alt="stop" /><br/>Restaurant<br/>District</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    //
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDestination: setDestination
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StopGraph);