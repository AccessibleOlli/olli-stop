import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPOI, deselectPOI, setPOIDirections } from '../actions/index';
import getDirections from '../util/directions';
import POIDirections from './poi_directions';

class Info extends Component {

  constructor() {
    super();
    this.state = {
      loadingdirections: false,
      directions: []
    }
  }

  onDirectionsClick() {
    console.log('onDirectionsClick');
    getDirections(this.props.selectedPOIs)
      .then((directions) => {
        console.log(directions);
        this.props.setPOIDirections(directions);
      });
  }

  onPOIClick(poiclicked) {
    if (poiclicked.selected)
      this.props.deselectPOI(poiclicked);
    else
      this.props.selectPOI(poiclicked);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return !this.loadingdirections;
  // }

  render() {
    let cognitivePersona = this.props.activePersonaTypes.cognitive;
    let cognitivePersonaOnly = (
      this.props.activePersonaTypes.cognitive &&
      !this.props.activePersonaTypes.deaf &&
      !this.props.activePersonaTypes.blind &&
      !this.props.activePersonaTypes.wheelchair
    );

    let info_subtitle_class = "info-subtitle";
    let select_stop_msg = "Select a stop on the map";
    let select_stop_list = "";

    if (cognitivePersona) {
      // REFACTOR:TODO: Increase text size if a cognitive persona is present
      info_subtitle_class += " info-subtitle-larger";
    }
    if (!cognitivePersona) {
      select_stop_msg += " or the stop icons below the map";
    }
    if (cognitivePersonaOnly) {
      // REFACTOR:TODO: Change the number of pills, etc
    }
    if (this.props.activePersonaTypes.deaf) {
      select_stop_msg += " or sign a stop number: ";
      select_stop_list = <span>[1] Mayo Gonda<br/>[2] Peace Plaza<br/>[3] Restaurant District<br/>[5] Mayo Guggenheim</span>
    }


    let className = this.props.activePersona ? 'info-win' : 'info-win-hidden';

    let msgs = [];

    // if no destination is set just show a welcome message
    let welcome = "Welcome";
    if (!this.props.destinationStopName) {
      if (this.props.activePersona) {
        welcome += ", " + this.props.activePersona.name;
      }
      welcome += ".";
      let msg = <div>
        <h1>{welcome}<br />Where would you like to go?</h1>
        <h2 className={info_subtitle_class}>{select_stop_msg}</h2>
        <p className="info-stop-list">{select_stop_list}</p>
      </div>;
      return (
        <div className={className}><hr />{msg}</div>
      );
    }

    msgs.push(<div key={msgs.length}><h2 className="info-subtitle">Destination:</h2><h1 className="destination">{this.props.destinationStopName}</h1></div>);

    let poipills = null;
    let triggerdirections = null;
    if (this.props.pois) {
      let anypoiselected = false;
      msgs.push(<h2 key={msgs.length} className="info-subtitle">I've found some places you may want to visit near your stop. Select some to add to your trip.</h2>);
      msgs.push(<br key={msgs.length} />);

      poipills = this.props.pois.map((poi, index) => {
        let poistate = "deselected";
        if (poi.selected) {
          poistate = "selected";
          anypoiselected = true;
        }
        let states = "poi-pill " + poistate;
        return <button key={index} className={states} name={poi.name} onClick={(e) => this.onPOIClick(poi)}>{poi.name}</button>
      });
      if (anypoiselected) {
        let waypoints = [<span key={this.props.destinationStopName}>{this.props.destinationStopName}</span>];
        waypoints.push(this.props.pois.map((poi, index) => {
          if (poi.selected) return (<span key={poi.id}>{" => "}{poi.name}</span>);
          return null;
        }));
        triggerdirections = <div className="trigger-directions"><h2 className="info-subtitle">Trip:</h2><h3>{waypoints}</h3><button key="directionsbutton" className="directions-button" onClick={(e) => this.onDirectionsClick()}>Get trip directions >></button></div>;
      }

    } else {
      // destination selected, but POIs have not loeaded yet
      msgs.push(<h2 key={msgs.length} className="info-subtitle" style={{ textDecoration: 'blink' }}>Searching for relevant additional points of interest...</h2>);
    }

    if (this.props.poiDirections && this.props.poiDirections.legs.length > 0) {
      return (
        <div className={className}>
          <hr />
          <POIDirections />
        </div>
      )
    }
    else {
      return (
        <div className={className}>
          <hr />
          {msgs}
          {poipills}
          {triggerdirections}
        </div>
      )
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectPOI: selectPOI,
    deselectPOI: deselectPOI,
    setPOIDirections: setPOIDirections
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    destinationStopName: state.destinationStopName,
    activePersona: state.activePersona,
    activePersonaTypes: state.activePersonaTypes,
    message: state.mapMsg,
    pois: state.pois,
    selectedPOIs: state.selectedPOIs,
    poiDirections: state.poiDirections
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
