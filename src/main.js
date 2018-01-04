import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import reducers from './reducers';
import Clock from './components/clock';
// import Talk from './components/talk';
import Map from './components/map';
// import Progress from './components/progress';
import Info from './components/info';
// import Arrival from './components/arrival';
import OlliLogo from './components/olli_logo';
import StopHeader from './components/stop_header';
import StopGraph from './components/stop_graph';
import POISNearby from './components/pois_nearby';
// import Talk from './components/talk';
// import Chat from './components/chat';
import Weather from './components/weather';
// import Credits from './components/credits';
import Stops from './data/stops.json';
import KinTrans from './components/kintrans';
import Monitor from './components/monitor/Monitor';

const OLLI_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_STOP_IDX'], 10) || 0;
const REMOTE_WS = process.env['REACT_APP_REMOTE_WS'];
const WEATHER_URL = process.env['REACT_APP_WEATHER_URL'] || (REMOTE_WS ? REMOTE_WS.replace('ws', 'http') + '/weather/{lat}/{lon}' : '')
const WEATHER_REFRESH_MIN = 10

class Main extends Component {

  constructor() {
    super();
  }

  render() {
    console.log(this.props.personas);
    let stop = Stops.features[OLLI_STOP_IDX];
    let patrons = false;
    if (this.props.personas) {
      for (let persona of this.props.personas) {
        if (persona.isInside) {
          patrons = true;
          break;
        }
      }
    }
    console.log(patrons);
    if (!patrons) {
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

function mapStateToProps(state) {
  return {
    kinTransInUse: state.kinTransInUse,
    personas: state.personas
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    //
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);