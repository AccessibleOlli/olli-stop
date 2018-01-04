import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setDestination } from './actions/index';
import Clock from './components/clock';
import Info from './components/info';
import KinTrans from './components/kintrans';
import Map from './components/map';
import OlliLogo from './components/olli_logo';
import POISNearby from './components/pois_nearby';
import StopHeader from './components/stop_header';
import StopGraph from './components/stop_graph';
import Weather from './components/weather';
import Stops from './data/stops.json';

// import Monitor from './components/monitor/Monitor';

const OLLI_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_STOP_IDX'], 10) || 0;
const OLLI_BLIND_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_BLIND_STOP_IDX'], 10) || 0;
const OLLI_BLIND_STOP_DELAY = parseInt(process.env['REACT_APP_OLLI_BLIND_STOP_DELAY'], 10) || 2000;
const REMOTE_WS = process.env['REACT_APP_REMOTE_WS'];
// REACT_APP_WEATHER_URL should be in the format similar to: http://host.domain.com/weather/{lat}/{lon}
// {lat} and {lon} will be replaced with actual latitude and longitude later by the Weather component
const WEATHER_URL = process.env['REACT_APP_WEATHER_URL'] || (REMOTE_WS ? REMOTE_WS.replace('ws', 'http') + '/weather/{lat}/{lon}' : '')
const WEATHER_REFRESH_MIN = 10


class Main extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePersona && nextProps.activePersona !== this.props.activePersona) {
      if (nextProps.activePersona.blind) {
        let welcome = "Welcome";
        welcome += ", " + nextProps.activePersona.name;
        welcome += ". To go to Mayo Gonda say one.";
        console.log('AUDIO: ' + welcome);
        setTimeout(() => {
          console.log(Stops.features[OLLI_BLIND_STOP_IDX]);
          this.props.setDestination(Stops.features[OLLI_BLIND_STOP_IDX].properties.name);
        }, OLLI_BLIND_STOP_DELAY);
      }
    }
  }

  render() {
    let stop = Stops.features[OLLI_STOP_IDX];
    if (!this.props.activePersona) {
      return (
          <div className="cssgrid">
            <OlliLogo />
            <StopHeader stop={stop} />
            <Map stop={stop} fullscreen={true} />
            {/* <Monitor /> */}
          </div>
      );
    }
    else {
      let cognitivePersonaOnly = (
        this.props.activePersonaTypes.cognitive &&
        ! this.props.activePersonaTypes.deaf &&
        ! this.props.activePersonaTypes.blind &&
        ! this.props.activePersonaTypes.wheelchair
      );
      if (cognitivePersonaOnly) {
        return (
          <div className="cssgrid">
            <OlliLogo />
            <StopHeader stop={stop} />
            <div className="clock-weather">
              <Clock />
              <Weather serviceurl={WEATHER_URL} refreshrate={WEATHER_REFRESH_MIN} />
            </div>
            <KinTrans />
            <Info />
            <Map stop={stop} fullscreen={false} />
            {/* <Monitor /> */}
          </div>
        );
      }
      else {
        return (
          <div className="cssgrid">
            <OlliLogo />
            <StopHeader stop={stop} />
            <div className="clock-weather">
              <Clock />
              <Weather serviceurl={WEATHER_URL} refreshrate={WEATHER_REFRESH_MIN} />
            </div>
            <KinTrans />
            <Info />
            <Map stop={stop} fullscreen={false} />
            <StopGraph />
            <POISNearby />
            {/* <Monitor /> */}
          </div>
        );
      }
    }
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