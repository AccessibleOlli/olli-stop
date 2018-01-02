import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setKinTransAvatarMessage } from '../actions/index'
import Unity from 'react-unity-webgl'
import { SendMessage } from 'react-unity-webgl'



class KinTrans extends Component {

  componentDidMount() 
  {
    //this.setAvatarMessage("i need help");
  }

  setAvatarMessage(msg) 
  {
    this.props.setAvatarMessage(msg);
  }

  render() {

    SendMessage("OlliCommunication", "startSimulationMessage", this.props.kintransAvatarMessage);

    return (
      <div className="kintrans-avatar">
        {/* <Unity
            src='./kintrans/Build/KinTransAvatarBuild.json'
            loader='./kintrans/Build/UnityLoader.js' /> */}
        <img src="./img/signing.png" style={{width:'444px',height:'224px'}} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    kintransAvatarID: state.kintransAvatar.id,
    kintransAvatarMessage: state.kintransAvatar.message,
    kintransAvatarTimestamp: state.kintransAvatar.timestamp,

    //DELETE THIS (its for testing, it triggers avatar on click of a stop button)
    selectedPOIs: state.selectedPOIs //TEST AVATAR BY CLICKING MAP
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setAvatarMessage: setKinTransAvatarMessage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KinTrans);