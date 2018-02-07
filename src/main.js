import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setDestination, setKinTransInUse, addPersona } from './actions/index';
import PouchDB from 'pouchdb';
import ClockWeather from './components/clock_weather';
import Info from './components/info';
import KinTrans from './components/kintrans';
import Map from './components/map';
import OlliLogo from './components/olli_logo';
import POISNearby from './components/pois_nearby';
import StopHeader from './components/stop_header';
// import StopGraph from './components/stop_graph';
import Stops from './data/stops.json';
import uuidV4 from 'uuid/v4';

// import Monitor from './components/monitor/Monitor';

const REMOTE_EVENT_DB = process.env['REACT_APP_REMOTE_EVENT_DB'];
const OLLI_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_STOP_IDX'], 10) || 0;
const OLLI_BLIND_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_BLIND_STOP_IDX'], 10) || 0;
const OLLI_BLIND_STOP_DELAY = parseInt(process.env['REACT_APP_OLLI_BLIND_STOP_DELAY'], 10) || 2000;

class Main extends Component {

  constructor() {
    super();
    this.db = new PouchDB(REMOTE_EVENT_DB, {});
  }

  playAudio(text, type) {
    let doc = {
      _id: `${type}:${uuidV4()}`,
      event: type,
      payload: {
        type: 'audio',
        text: text,
        audio_zone: 'olli-stop',
        accept: 'audio/mp3',
        tag: type,
        local: `${type}.m4a`,
        audio_params: {
          text: text,
          accept: 'audio/mp3'
        },
        'filename': `${type}.mp3`
      }    
    };
    this.db.put(doc)
      .then((response) => {
        console.log(response);
      }).catch((err) => {
        console.log(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      if (nextProps.activePersona.blind) {
        let text = "Welcome";
        text += ", " + nextProps.activePersona.name;
        text += ". Say the stop number for your destination.";
        let type = 'audio_olli_stop_welcome';
        this.playAudio(text, type);
        // setTimeout(() => {
        //   let stopName = Stops.features[OLLI_BLIND_STOP_IDX].properties.name;
        //   let text = `You selected ${stopName}. Enjoy your trip on Olli.`;
        //   let type = 'audio_olli_stop_destination';
        //   this.playAudio(text, type);
        //   this.props.setDestination(stopName);
        // }, OLLI_BLIND_STOP_DELAY);
      }
    }
  }

  doEntry() {
    let persona = {
      "name": "Katherine",
      "preferences": {
        "mobile_phone" : "507-234-2234",
        "cuisine" : "Italian"
      },
      "cognitive": true
    };
    this.props.addPersona(persona);
    this.props.setKinTransInUse(false);
  }

  render() {
    let stop = Stops.features[OLLI_STOP_IDX];

    if (!this.props.activePersona) {
      return (
        <div className="cssgrid">
        <button key="enterbutton" className="enter-button" onClick={(e) => this.doEntry()}>Enter</button>
          <OlliLogo />
          <StopHeader stop={stop} />
          <div className="mapboxgl-map-full">
            <Map stop={this.props.stop} />
          </div>
          <div id="bottom-blank" />
        </div>
      );
    }

    return (
      <div className="cssgrid">
        <OlliLogo />
        <StopHeader stop={stop} />
        <div id="col1">
          <KinTrans />
          <Info />
        </div>
        <div id="col2">
          <ClockWeather />
          <div className="mapboxgl-map-normal">
            <Map stop={this.props.stop} />
          </div>
          {/* <StopGraph /> */}
        </div>
        <POISNearby />
        <div id="bottom-blank" style={{backgroundColor: "#FFFFFF"}} />
        {/* <Monitor /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    kinTransInUse: state.kinTransInUse,
    activePersona: state.activePersona,
    activePersonaTypes: state.activePersonaTypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDestination: setDestination, 
    setKinTransInUse: setKinTransInUse, 
    addPersona: addPersona
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);