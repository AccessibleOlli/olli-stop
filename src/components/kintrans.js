import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setKinTransAvatarMessage } from '../actions/index'
import Unity from 'react-unity-webgl'
import { SendMessage } from 'react-unity-webgl'
import { setTimeout } from 'core-js/library/web/timers';

const WAIT_TIME_AFTER_WELCOME = 8000;
const CLEAR_WELCOME_MESSAGE_TIME = 10000;

class KinTrans extends Component {

  constructor() {
    super();
    this.unityLoaded = false;
    this.unityLoading = false;
    this.state = {
      currentKinTransMessage: '',
      currentText: ''
    };
  }

  onUnityProgress(progression) {
    if (! this.unityLoaded && ! this.unityLoading) {
      if (progression === 1) {
        this.unityLoading = true;
        setTimeout( () => {
          this.unityLoaded = true;
          if (this.state.currentKinTransMessage.length > 0) {
            this.setAvatarMessage(this.state.currentKinTransMessage, this.state.currentText);
          }
        }, 2000);
      }
    }
  }

  setAvatarMessage(kintransMessage, text) {
    this.setState({currentKinTransMessage: kintransMessage});
    this.setState({currentText: text});
    if (this.unityLoaded) {
      try {
        SendMessage('OlliCommunication', 'startSimulationMessage', kintransMessage);
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  getWelcomeKinTransMessage() {
    return 'i need help';
  }

  getWelcomeTextMessage() {
    return 'Hello, Welcome to Olli!';
  }

  getSelectStopKinTransMessage() {
    return 'sign number';
  }

  getSelectStopTextMessage() {
    return 'Please select your destination by signing a stop number'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      let text = this.getWelcomeTextMessage();
      this.setAvatarMessage(this.getWelcomeKinTransMessage(), this.getWelcomeTextMessage());
      setTimeout(() => {
        this.setAvatarMessage(this.getSelectStopKinTransMessage(), this.getSelectStopTextMessage());
        setTimeout(() => {
          this.setState({currentText: ''});
        }, CLEAR_WELCOME_MESSAGE_TIME);
      }, WAIT_TIME_AFTER_WELCOME);
    }
  }

  render() {
    //SendMessage("OlliCommunication", "startSimulationMessage", this.props.kintransAvatarMessage); 
    let className = this.props.activePersona ? 'kintrans-avatar' : 'kintrans-avatar-hidden';
    let text = this.unityLoaded ? this.state.currentText : '';   
    return (
      <div className="kintrans">
        <div className={className}>
          <Unity
              src='./kintrans/Build/KinTrans Avatar Build.json'
              loader='./kintrans/Build/UnityLoader.js'
              onProgress={(e) => {this.onUnityProgress(e)} }
          />
        </div>
        <div className="kintrans-avatar-text">
          <h2>{text}</h2>
        </div>
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