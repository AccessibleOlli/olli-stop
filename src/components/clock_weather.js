import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Clock from './clock';
import Weather from './weather';

const REMOTE_WS = process.env['REACT_APP_REMOTE_WS'];
// REACT_APP_WEATHER_URL should be in the format similar to: http://host.domain.com/weather/{lat}/{lon}
// {lat} and {lon} will be replaced with actual latitude and longitude later by the Weather component
const WEATHER_URL = process.env['REACT_APP_WEATHER_URL'] || (REMOTE_WS ? REMOTE_WS.replace('ws', 'http') + '/weather/{lat}/{lon}' : '')
const WEATHER_REFRESH_MIN = 10

class ClockWeather extends Component {

  render() {
    let className = this.props.activePersona ? 'clock-weather' : 'clock-weather-hidden';   
    return (
      <div className={className}>
        <Clock />
        <Weather serviceurl={WEATHER_URL} refreshrate={WEATHER_REFRESH_MIN} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activePersona: state.activePersona
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // 
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockWeather);