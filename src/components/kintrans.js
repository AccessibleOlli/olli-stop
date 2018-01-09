import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setKinTransAvatarMessage } from '../actions/index'
import Unity from 'react-unity-webgl'
import { SendMessage } from 'react-unity-webgl'
import { setTimeout } from 'core-js/library/web/timers';

const WAIT_TIME_AFTER_WELCOME = 8000;
const CLEAR_WELCOME_MESSAGE_TIME = 10000;
const CLEAR_DIRECTIONS_MESSAGE_TIME = 10000;

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
        console.log("Sending kintrans message: "+kintransMessage);
        SendMessage('OlliCommunication', 'startSimulationMessage', kintransMessage);
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  getWelcomeTextMessage() {
    return 'welcome'; //'Hello, Welcome to Olli!';
  }

  getSelectStopKinTransMessage() {
    return 'sign number';
  }

  getSelectStopTextMessage() {
    return 'where go'; //'Please select your destination by signing a stop number'
  }

  getTextDirectionsKinTransMessage() {
    return 'directions phone'; //'Would you like directions sent to your phone?'
  }

  getTextDirectionsTextMessage() {
    return 'directions phone'; //'Would you like directions sent to your phone?' 
  }

  getArrivingMessage() {
    return 'olli arrive'; //Olli is arriving
  }

  getStopMessage() {
    return 'disembark'; // Olli	will	be	stopped	as	long	as	you	need to	disembark.
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      this.setAvatarMessage(this.getWelcomeTextMessage(), this.getWelcomeTextMessage());
      setTimeout(() => {
        this.setAvatarMessage(this.getSelectStopKinTransMessage(), this.getSelectStopTextMessage());
        setTimeout(() => {
          this.setState({currentText: ''});
        }, CLEAR_WELCOME_MESSAGE_TIME);
      }, WAIT_TIME_AFTER_WELCOME);
    }
    if (nextProps.poiDirections !== this.props.poiDirections) {
      if (nextProps.poiDirections && nextProps.poiDirections.legs.length > 0) {
        this.setAvatarMessage(this.getTextDirectionsKinTransMessage(), this.getTextDirectionsTextMessage());
        setTimeout(() => {
          this.setState({currentText: ''});
        }, CLEAR_DIRECTIONS_MESSAGE_TIME);
      }
    }
  }

  render() {
    let className = this.props.activePersona ? 'kintrans-avatar' : 'kintrans-avatar-hidden';
    // let text = this.unityLoaded ? this.state.currentText : '';   
    let text = this.state.currentText;
    return (
      <div className="kintrans">
        <div className={className}>
          <Unity
              src='./kintrans/Build/olli.json'
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
    poiDirections: state.poiDirections
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setAvatarMessage: setKinTransAvatarMessage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(KinTrans);