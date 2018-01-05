import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setDestination } from './actions/index';
import PouchDB from 'pouchdb';
import ClockWeather from './components/clock_weather';
import Info from './components/info';
import KinTrans from './components/kintrans';
import MapWrapper from './components/map_wrapper';
import OlliLogo from './components/olli_logo';
import POISNearby from './components/pois_nearby';
import StopHeader from './components/stop_header';
import StopGraph from './components/stop_graph';
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      if (nextProps.activePersona.blind) {
        let welcome = "Welcome";
        welcome += ", " + nextProps.activePersona.name;
        welcome += ". To go to Mayo Gonda say one.";
        console.log('AUDIO: ' + welcome);
        let doc = {
          _id: `audio_persona_welcome:${uuidV4()}`,
          event: 'audio_persona_welcome',
          payload: {
            type: 'audio',
            text: welcome,
            audio_zone: 'olli-stop',
            accept: 'audio/mp3',
            tag: 'audio_persona_welcome',
            local: '',
            parameters: ''
          }
        };
        this.db.put(doc)
          .then((response) => {
            console.log(response);
          }).catch((err) => {
            console.log(err);
          });
        console.log(doc);
        setTimeout(() => {
          console.log(Stops.features[OLLI_BLIND_STOP_IDX]);
          this.props.setDestination(Stops.features[OLLI_BLIND_STOP_IDX].properties.name);
        }, OLLI_BLIND_STOP_DELAY);
      }
    }
  }

  render() {
    console.log(this.props.activePersona);
    console.log(this.props.activePersonaTypes);
    let stop = Stops.features[OLLI_STOP_IDX];
    return (
      <div className="cssgrid">
        <OlliLogo />
        <StopHeader stop={stop} />
        <ClockWeather />
        <KinTrans />
        <Info />
        <MapWrapper stop={stop} />
        <StopGraph />
        <POISNearby />
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
    setDestination: setDestination
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);