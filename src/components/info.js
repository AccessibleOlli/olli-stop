import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { selectPOI, deselectPOI, setPOIDirections } from '../actions/index';
import getDirections from '../util/directions'
import POIDirections from './poi_directions'

const THIS_STOP = [-92.467148454828,44.022351687354];

const mapboxglaccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
var mapboxdirections = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving'
});

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
      if ((!this.props.message || !this.props.message.messageHtml) && !this.props.destinationStopName) {
          let msg = <div><h1>Welcome. Where would you like to go?</h1><h2>Select a stop above the map.</h2></div>;
          return (
              <div className="info-win"><hr/>{msg}</div>
          );
      }

      // if we're showing directions, only show that and nothing else
      // MARK this is for you...
      // end directions
      

      if (!this.props.message && this.props.destinationStopName) {
        msgs.push(<h2 key={msgs.length}>Your destination is {this.props.destinationStopName}</h2>);
      }

      let poipills = null;
      let directionsbutton = null;
      if (this.props.pois) {
        let anypoiselected = false;
        msgs.push(<p key={msgs.length}>I've found some places you may like to visit near your stop. Click on them to add to your trip</p>);
        poipills = this.props.pois.map((poi, index) => {
          let poistate = "deselected";
          if (poi.selected) {
            poistate = "selected";
            anypoiselected = true;
          }
          let states = "poi-pill "+poistate;
          return <button key={index} className={states} name={poi.name} onClick={(e)=>this.onPOIClick(poi)}>{poi.name}</button>
        });
        if (anypoiselected) 
          directionsbutton = <button key="directionsbutton" className="directionsbutton" onClick={(e)=>this.onDirectionsClick()}>Get trip directions</button>
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
            {directionsbutton}
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
      message: state.mapMsg, 
      pois: state.pois,
      selectedPOIs: state.selectedPOIs,
      poiDirections: state.poiDirections
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Info);
