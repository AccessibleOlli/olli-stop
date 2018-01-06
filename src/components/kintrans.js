import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setKinTransAvatarMessage } from '../actions/index'
import Unity from 'react-unity-webgl'
import { SendMessage } from 'react-unity-webgl'
import DISPLAY_STOPS from '../data/display_stops.json'

const WAIT_TIME_AFTER_WELCOME = 3000;
const WAIT_TIME_AFTER_STOP = 5000;

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
    //return 'Welcome to Olli.....';
    return 'i need help';
  }

  getWelcomeTextMessage() {
    return 'Welcome to Olli';
  }

  getStopKinTransMessage(index) {
    let stop = DISPLAY_STOPS[index];
    // return XXX
    return 'i need help';
  }

  getStopTextMessage(index) {
    let stop = DISPLAY_STOPS[index];
    return `Sign ${stop.number} for ${stop.name}`
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      let text = this.getWelcomeTextMessage();
      this.setAvatarMessage(this.getWelcomeKinTransMessage(), this.getWelcomeTextMessage());
      const setStopMessage = (index) => {
        this.setAvatarMessage(this.getStopKinTransMessage(index), this.getStopTextMessage(index));
        if (index < 4) {
          setTimeout(() => {
            setStopMessage(index + 1);
          }, WAIT_TIME_AFTER_STOP)
        }
      }
      setTimeout(() => {
        setStopMessage(1);
      }, WAIT_TIME_AFTER_WELCOME);
    }
  }

  render() {
    //SendMessage("OlliCommunication", "startSimulationMessage", this.props.kintransAvatarMessage); 
    let className = this.props.activePersona ? 'kintrans-avatar' : 'kintrans-avatar-hidden';
    let text = this.unityLoaded ? this.state.currentText : '';   
    return (
      <div>
        <div className={className}>
          <Unity
              src='./kintrans/Build/KinTransAvatarBuild.json'
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