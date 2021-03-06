import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPOIs } from '../actions/index'
import POIList from '../components/poi_list';
import POISelectedList from '../components/poi_selected_list'
import POIDirections from '../components/poi_directions'
import axios from 'axios';

class Chat extends Component {

  converse(text) {
    console.log('User/Button: ' + text);
    var data = {
      text: text,
      skipTTS: true
    };
    return axios({
      method: 'POST',
      url: '/api/conversation/converse',
      data: data
    })
      .then((converationResponse) => {
        let pois = [];
        if (converationResponse.data.card) {
          pois = converationResponse.data.card.content;
        }
        this.props.setPOIs(pois);
        console.log('Olli: ' + converationResponse.data.response);
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="stop-panel">
        <button className='bx--btn bx--btn--secondary btn--bigaction' onClick={() => this.converse('show me restaurants near peace plaza')}>Restaurants</button>
        <button className='bx--btn bx--btn--secondary btn--bigaction' onClick={() => this.converse('show me pharmacies near peace plaza')}>Pharmacies</button>
        <POISelectedList />
        <POIDirections />
        <POIList />
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);