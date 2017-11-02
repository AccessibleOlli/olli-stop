import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOlliRouteVisibility } from '../actions/index'
import axios from 'axios';
import watsonSpeech from 'watson-speech';


class Buttons extends Component {

  constructor() {
    super();
    this.state = {
      talking: false
    }
    this.stream = null;
  }

  toggleTalking() {
    if (this.state.talking) {
      this.setState({ talking: false });
      if (this.stream) {
        this.stream.stop();
      }
    }
    else {
      this.setState({ talking: true });
      axios({
        method: 'GET',
        url: '/api/stt/token'
      }).then((response) => {
        this.stream = watsonSpeech.SpeechToText.recognizeMicrophone({
          token: response.data.token,
          keepMicrophone: true,
          continuous: false,
          outputElement: null
        });
        this.stream.promise().then((sttResponse) => {
          var responseObject = {
            text: sttResponse
          };
          return axios({
            method: 'POST',
            url: '/api/conversation/converse',
            data: responseObject
          });
        }).then((converationResponse) => {
          var byteString = atob(converationResponse.data.voice);
          // write the bytes of the string to an ArrayBuffer
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          // write the ArrayBuffer to a blob, and you're done
          var blob = new Blob([ab], { type: 'audio/ogg' });
          const url = window.URL.createObjectURL(blob);
          var audioElement = new Audio(url);
          audioElement.play();
        }).catch(err => {
          console.log("ERROR");
          console.log(err);
        });
        this.stream.on('error', (err) => {
          console.log("we are in error function: i.e. error is produced when calling STT");
          console.log(err);
        });
      });
    }
  }

  toggleRoute(hide) {
    if (hide) {
      this.props.setOlliRouteVisibility('none');
    }
    else {
      this.props.setOlliRouteVisibility('visible');
    }
  }

  renderTalkButton() {
    const text = this.state.talking ? "Stop" : "Talk";
    return (
      <button className='button' onClick={() => this.toggleTalking()}>{text}</button>
    );
  }

  render() {
    let hide = false;
    let text = 'Show';
    if (this.props.olliRouteVisibility === 'visible') {
      hide = true;
      text = 'Hide';
    }
    if (!this.props.olliRoute) {
      return (
        <div style={{ margin: 10 }} className="absolute top left pill">
          {this.renderTalkButton()}
        </div>
      );
    }
    else {
      return (
        <div style={{ margin: 10 }} className="absolute top left pill">
          {this.renderTalkButton()}
          <button className='button' onClick={() => this.toggleRoute(hide)}>{text} Route</button>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    olliRoute: state.olliRoute,
    olliRouteVisibility: state.olliRouteVisibility
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setOlliRouteVisibility: setOlliRouteVisibility
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);