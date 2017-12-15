import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deselectPOI, setPOIDirections } from '../actions/index'
import POISelectedListItem from './poi_selected_list_item';
import axios from 'axios';

const THIS_STOP = [-92.467148454828,44.022351687354];
const mapboxglaccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
var mapboxdirections = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving'
});

class POISelectedList extends Component {

  showDirections(poi) {
    let lon = poi.coordinates.longitude;
    let lat = poi.coordinates.latitude;
    let dirurl = "/"+THIS_STOP[0]+","+THIS_STOP[1]+";"+lon+","+lat; //-92.466,44.024";
    dirurl += "?access_token="+mapboxglaccessToken+"&overview=false&steps=true&annotations=distance";
    mapboxdirections.get(dirurl)
      .then(response => {
        // console.log("Got directions!!");
        let steps = response.data.routes[0].legs[0].steps;
        let stepdirections = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            let d = step.maneuver.instruction;
            if ( step.distance > 2 )
                d += " and travel "+step.distance+" meters";
            stepdirections.push(d);
        }
        this.props.setPOIDirections({
          poi: poi,
          directions: stepdirections
        });
    })
    .catch(error => {
        this.setState({loadingdirections: false, directions: JSON.stringify(error)});
        console.log("Error getting directions: "+error);
    });
  }

  deselectPOI(poi) {
    this.props.deselectPOI(poi);
  }

  render() {
    let selectedPOIs = [];
    if (this.props.selectedPOIs) {
      this.props.selectedPOIs.forEach((poi) => {
        selectedPOIs.push(
          <POISelectedListItem
            poi={poi}
            onShowDirections={(poi) => this.showDirections(poi)}
            onRemove={(poi) => this.deselectPOI(poi)}
          />
        )
      });
    }
    return (
      <div>
        {selectedPOIs}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedPOIs: state.selectedPOIs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deselectPOI: deselectPOI,
    setPOIDirections: setPOIDirections
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(POISelectedList);