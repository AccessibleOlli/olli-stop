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

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      let message = 'Hello Welcome to Olli!';
      message = 'i need help';
      SendMessage('OlliCommunication', 'startSimulationMessage', message);
    }
  }

  render() {
    //SendMessage("OlliCommunication", "startSimulationMessage", this.props.kintransAvatarMessage); 
    let className = this.props.activePersona ? 'kintrans-avatar' : 'kintrans-avatar-hidden';   
    return (
      <div className={className}>
        <Unity
            src='./kintrans/Build/KinTransAvatarBuild.json'
            loader='./kintrans/Build/UnityLoader.js' />
        {/* <img src="./img/signing.png" style={{width:'444px',height:'224px'}} /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona,
    destinationStopName: state.destinationStopName,
    kintransAvatarID: state.kintransAvatar.id,
    kintransAvatarMessage: state.kintransAvatar.message,
    kintransAvatarTimestamp: state.kintransAvatar.timestamp,
    kinTransInUse: state.kinTransInUse
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setAvatarMessage: setKinTransAvatarMessage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KinTrans);