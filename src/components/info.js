import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import axios from 'axios';
import { selectPOI, deselectPOI, setPOIDirections } from '../actions/index';
import getDirections from '../util/directions';
import POIDirections from './poi_directions';

// const THIS_STOP = [-92.467148454828,44.022351687354];

// const mapboxglaccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
// var mapboxdirections = axios.create({
//     baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving'
// });

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
      let msgs = [];

      // if no destination is set just show a welcome message
      let welcome = "Welcome";
      if (!this.props.destinationStopName) {
        if (this.props.personas && this.props.personas.length > 0 && this.props.personas[0].name) {
          welcome += ", " + this.props.personas[0].name;
        }
        welcome += ".";
        let msg = <div><h1>{welcome}<br/>Where would you like to go?</h1><h2 className="info-subtitle">Select a stop on or below the map.</h2></div>;
          return (
              <div className="info-win"><hr/>{msg}</div>
          );
      }

      // if we're showing directions, only show that and nothing else
      // MARK this is for you...
      // end directions
      

      msgs.push(<div key={msgs.length}><h2 className="info-subtitle">Destination:</h2><h1 className="destination">{this.props.destinationStopName}</h1></div>);

      let poipills = null;
      let triggerdirections = null;
      if (this.props.pois) {
        let anypoiselected = false;
        msgs.push(<h2 key={msgs.length} className="info-subtitle">I've found some places you may want to visit near your stop. Select some to add to your trip.</h2>);
        msgs.push(<br key={msgs.length}/>);

        poipills = this.props.pois.map((poi, index) => {
          let poistate = "deselected";
          if (poi.selected) {
            poistate = "selected";
            anypoiselected = true;
          }
          let states = "poi-pill "+poistate;
          return <button key={index} className={states} name={poi.name} onClick={(e)=>this.onPOIClick(poi)}>{poi.name}</button>
        });
        if (anypoiselected) {
          let waypoints = [<span>{this.props.destinationStopName}</span>];
          waypoints.push(this.props.pois.map((poi, index) => {
            if (poi.selected) return (<span>{" => "}{poi.name}</span>);
            return null;
          }));
          triggerdirections = <div className="trigger-directions"><h2 className="info-subtitle">Trip:</h2><h3>{waypoints}</h3><button key="directionsbutton" className="directions-button" onClick={(e)=>this.onDirectionsClick()}>Get trip directions >></button></div>;
        }

      } else {
        // destination selected, but POIs have not loeaded yet
        msgs.push(<h2 key={msgs.length} className="info-subtitle" style={{textDecoration:'blink'}}>Searching for relevant additional points of interest...</h2>);
      }

      if (this.props.poiDirections && this.props.poiDirections.legs.length > 0) {
        return (
          <div className="info-win">
            <hr/>
            <POIDirections />
          </div>
        )
      }
      else {
        return (
          <div className="info-win">
            <hr/>
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
      personas: state.personas,
      message: state.mapMsg, 
      pois: state.pois,
      selectedPOIs: state.selectedPOIs,
      poiDirections: state.poiDirections
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Info);
