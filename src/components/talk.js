import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPOIs } from '../actions/index'
import axios from 'axios';
import watsonSpeech from 'watson-speech';

class Talk extends Component {

  constructor() {
    super();
    this.state = {
      talking: false,
      text: ''
    }
    this.stream = null;
    this.token = null;
  }

  getRecognizeOptions() {
    return {
      token: this.token,
      keepMicrophone: true,
      continuous: false,
      outputElement: null,
      interim_results: true,
      objectMode: true
    };
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
        this.token = response.data.token;
        this.startStream();
      // this.stream = watsonSpeech.SpeechToText.recognizeMicrophone(this.getRecognizeOptions());
      //   this.stream.promise().then((sttResponse) => {
      //     console.log('User: ' + sttResponse);
      //     console.log(sttResponse);
      //     var responseObject = {
      //       text: sttResponse
      //     };
      //     return axios({
      //       method: 'POST',
      //       url: '/api/conversation/converse',
      //       data: responseObject
      //     });
      //   }).then((converationResponse) => {
      //     let pois = [];
      //     if (converationResponse.data.card) {
      //       pois = converationResponse.data.card.content;
      //     }
      //     this.props.setPOIs(pois);
      //     console.log('Olli: ' + converationResponse.data.response);
      //     var byteString = atob(converationResponse.data.voice);
      //     // write the bytes of the string to an ArrayBuffer
      //     var ab = new ArrayBuffer(byteString.length);
      //     var ia = new Uint8Array(ab);
      //     for (var i = 0; i < byteString.length; i++) {
      //       ia[i] = byteString.charCodeAt(i);
      //     }
      //     // write the ArrayBuffer to a blob, and you're done
      //     var blob = new Blob([ab], { type: 'audio/ogg' });
      //     const url = window.URL.createObjectURL(blob);
      //     var audioElement = new Audio(url);
      //     audioElement.play();
      //   }).catch(err => {
      //     console.log(err);
      //   });
      //   this.stream.on('error', (err) => {
      //     console.log(err);
      //   });
      });
    }
  }

  startStream() {
    this.handleStream(watsonSpeech.SpeechToText.recognizeMicrophone(this.getRecognizeOptions()));
  }

  stopStream() {
    if (this.stream) {
      this.stream.stop();
      this.stream.removeAllListeners();
      this.stream.recognizeStream.removeAllListeners();
    }
  }

  processText(text) {
    console.log('User: ' + text);
    this.stopStream();
    this.setState({
      text: text
    });
    var responseObject = {
      text: text
    };
    return axios({
      method: 'POST',
      url: '/api/conversation/converse',
      data: responseObject
    })
    .then((converationResponse) => {
      let pois = [];
      if (converationResponse.data.card) {
        pois = converationResponse.data.card.content;
      }
      this.props.setPOIs(pois);
      console.log('Olli: ' + converationResponse.data.response);
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
      audioElement.addEventListener('ended', () => this.startStream(), false);
      audioElement.play();
    }).catch(err => {
      this.startStream();
      console.log(err);
    });
  }

  handleStream(stream) {
    console.log(stream);
    // cleanup old stream if appropriate
    this.stopStream();
    this.stream = stream;
    //this.captureSettings();

    // grab the formatted messages and also handle errors and such
    stream.on('data', (msg) => this.handleFormattedMessage(msg)).on('end', () => this.handleTranscriptEnd()).on('error', this.handleError);

    // when errors occur, the end event may not propagate through the helper streams.
    // However, the recognizeStream should always fire a end and close events
    stream.recognizeStream.on('end', () => {
      if (this.state.error) {
        this.handleTranscriptEnd();
      }
    });

    // grab raw messages from the debugging events for display on the JSON tab
    stream.recognizeStream
      .on('message', (frame, json) => this.handleRawMessage({ sent: false, frame, json }))
      .on('send-json', json => this.handleRawMessage({ sent: true, json }))
      .once('send-data', () => this.handleRawMessage({
        sent: true, binary: true, data: true, // discard the binary data to avoid waisting memory
      }))
      .on('close', (code, message) => this.handleRawMessage({ close: true, code, message }));
  }

  handleRawMessage(msg) {
    console.log('handleRawMessage');
    //console.log(msg);
    //this.setState({ rawMessages: this.state.rawMessages.concat(msg) });
  }

  handleFormattedMessage(msg) {
    //console.log('handleFormattedMessage');
    //console.log(msg);
    if (msg.results && msg.results.length > 0 && msg.results[0].final) {
      this.processText(msg.results[0].alternatives[0].transcript);
    }
    //this.setState({ formattedMessages: this.state.formattedMessages.concat(msg) });
  }

  handleTranscriptEnd() {
    // note: this function will be called twice on a clean end,
    // but may only be called once in the event of an error
    // mw:TODO
    //this.setState({ audioSource: null });
  }

  handleError(err, extra) {
    console.error(err, extra);
    if (err.name === 'UNRECOGNIZED_FORMAT') {
      err = 'Unable to determine content type from file name or header; mp3, wav, flac, ogg, opus, and webm are supported. Please choose a different file.';
    } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
      err = 'This browser does not support microphone input.';
    } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
      err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
    } else if (err.message === 'Invalid constraint') {
      // iPod Touch does this on iOS 11 - there is a microphone, but Safari claims there isn't
      err = 'Unable to access microphone';
    }
    this.setState({ error: err.message || err });
  }

  render() {
    const title = this.state.talking ? "Press to Send" : "Ask Olli";
    const text = this.state.text;
    return (
      <div className="stop-panel">
        <h2>{title}</h2>
        <button className='bx--btn bx--btn--secondary btn--bigaction' 
          onClick={() => this.toggleTalking()}>
          <img src="./img/noun_1012333_cc.png" alt="Press to talk to Olli" height="48px" />
          {text}
      </button>
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
    setPOIs: setPOIs
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Talk);