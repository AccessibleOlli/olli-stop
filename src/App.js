import axios from 'axios';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
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
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { setOlliRoute, setOlliPosition, startOlliTrip, endOlliTrip, setKinTransInUse, updatePersonas } from './actions/index';
import Stops from './data/stops.json';
import KinTrans from './components/kintrans';
import OLLI_ROUTE from './data/route.json';
import WebsocketManager from './util/websocket_manager';
import handleKinTransMessage from './util/kintrans_message_handler';
import Monitor from './components/monitor/Monitor';

import { ollieEvent } from "./actions"

require('dotenv').config()
PouchDB.plugin(PouchDBFind);

const store = createStore(reducers);
const REMOTE_WS = process.env['REACT_APP_REMOTE_WS'];
const REMOTE_TELEMETRY_DB = process.env['REACT_APP_REMOTE_TELEMETRY_DB'];
const REMOTE_EVENT_DB = process.env['REACT_APP_REMOTE_EVENT_DB'];
const REMOTE_PERSONA_DB = process.env['REACT_APP_REMOTE_PERSONA_DB'];
const REMOTE_DB = process.env['REACT_APP_REMOTE_DB'] || 'https://0fdf5a9b-8632-4315-b020-91e60e1bbd2b-bluemix.cloudant.com/ollilocation';
const OLLI_STOP_IDX = parseInt(process.env['REACT_APP_OLLI_STOP_IDX'], 10) || 0;

// REACT_APP_WEATHER_URL should be in the format similar to: http://host.domain.com/weather/{lat}/{lon}
// {lat} and {lon} will be replaced with actual latitude and longitude later by the Weather component
const WEATHER_URL = process.env['REACT_APP_WEATHER_URL'] || (REMOTE_WS ? REMOTE_WS.replace('ws', 'http') + '/weather/{lat}/{lon}' : '')
const WEATHER_REFRESH_MIN = 10

class App extends Component {

  constructor() {
    super();
    this.state = {
      stop: Stops.features[OLLI_STOP_IDX], 
      patrons: false
    }
    store.dispatch(setOlliRoute(OLLI_ROUTE));
    if (REMOTE_WS) {
      this.startWebsocket();
    }
    else if (REMOTE_TELEMETRY_DB && REMOTE_EVENT_DB) {
      this.startPouchDBAOSim();
    }
    else {
      this.startPouchDBOlliSim();
    }
    //
    this.websocketMgr = new WebsocketManager('/socket', (msg) => {
      if (msg.type === 'kintrans') {
        handleKinTransMessage(msg.body, store);
      }
    });
    this.websocketMgr.startWebsocket();
  }

  connectWebsocket() {
    if (this.websocketConnected) {
      console.log('Websocket already connected...');
    }
    else {
      console.log('Trying to connect to websocket...');
      this.websocketConnected = true;
      this.websocket = new WebSocket(REMOTE_WS);
      this.websocket.onopen = () => {
        this.websocketConnected = true;
        console.log('Socket opened');
      }
      this.websocket.onclose = () => {
        console.log('Socket closed');
        this.websocket = null;
        this.websocketConnected = false;
        setTimeout(() => {this.connectWebsocket()}, 5000);
      }
      this.websocket.onerror = (err) => {
        console.log('Socket error', err);
        this.websocket = null;
        this.websocketConnected = false;
        setTimeout(() => {this.connectWebsocket()}, 5000);
      }
      this.websocket.onmessage = (message) => {
        try {
          let doc = JSON.parse(message.data);
          if (doc.type === 'route_info') {
            store.dispatch(setOlliRoute(doc));
          }
          else if (doc.type === 'trip_start') {
            store.dispatch(startOlliTrip(doc));
          }
          else if (doc.type === 'trip_end') {
            store.dispatch(endOlliTrip(doc));
          }
          else if (doc.type === 'geo_position') {
            store.dispatch(setOlliPosition(doc));
          }
        }
        catch(e) {
          console.log(message.data);
        }
      }
    }
  }

  startWebsocket() {
    let remoteUrl = REMOTE_WS.replace('ws','http');
    axios.get(remoteUrl + '/info')
    .then(response => {
      console.log(response);
      if (response.data.started) {
        console.log('Simulator already running...');
        store.dispatch(setOlliRoute(response.data.route));
        return Promise.resolve(response);
      }
      else {
        console.log('Starting simulator...');
        return axios.get(remoteUrl + '/start');
      }
    })
    .then(response => {
      return axios.get(remoteUrl + '/info');
    })
    .then(response => {
      store.dispatch(setOlliRoute(response.data.route));
      this.connectWebsocket();
    })
    .catch(() => {
      setTimeout(() => {this.startWebsocket()}, 5000);
    });
  }

  startPouchDBOlliSim() {
    this.db = new PouchDB(REMOTE_DB, {});
    this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        if (store.getState().mapReady && change && change.doc && change.doc.type) {
          // olli-sim
          if (change.doc.type === 'route_info') {
            store.dispatch(setOlliRoute(change.doc));
          }
          else if (change.doc.type === 'trip_start') {
            store.dispatch(startOlliTrip(change.doc));
          }
          else if (change.doc.type === 'trip_end') {
            store.dispatch(endOlliTrip(change.doc));
          }
          else if (change.doc.type === 'geo_position') {
            if (! store.getState().olliRoute) {
              this.db.createIndex({
                index: {
                  fields: [{'type': 'desc'},{'ts': 'desc'}]
                }
              }).then(() => {
                return this.db.find({
                  selector: { "type": "route_info"},
                  sort: [{"type": "desc"}, {"ts": "desc"}],
                  limit: 1
                });
              }).then((result) => {
                if (result.docs && result.docs.length > 0) {
                  store.dispatch(setOlliRoute(result.docs[0]));
                  store.dispatch(setOlliPosition(change.doc));
                }
              }).catch((err) => {
                console.log(err);
              });
            }
            else {
              store.dispatch(setOlliPosition(change.doc));
            }
          }
        }
      }).on('complete', info => {
      }).on('paused', () => {
      }).on('error', err => {
        console.log(err);
    });
  }

  startPouchDBAOSim() {
    // telemetry
    this.db = new PouchDB(REMOTE_TELEMETRY_DB, {});
    this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        if (store.getState().mapReady && change && change.doc) {
          if (change.doc._id === 'telemetry_transition') {
            // ao_sim
            let ollis = [];
            while(true) {
              let i = ollis.length;
              let property = `olli_${i+1}`;
              if (change.doc.transport_data.olli_vehicles.hasOwnProperty(property)) {
                ollis.push(change.doc.transport_data.olli_vehicles[property]);
              }
              else {
                break;
              }
            }
            for(let i=0; i<ollis.length; i++) {
              let doc = {
                olliId: `olli_${i+1}`,
                coordinates: ollis[i].geometry.coordinates,
                distance_travelled: 0.14278461869690082,
                distance_remaining: 0.05605209177030407,
                properties: ollis[i].properties,
                ts: change.doc.timestamp
              };
              if (! store.getState().olliRoute) {
                console.log('No olli route. Cannot update olli position.');
              }
              else {
                store.dispatch(setOlliPosition(doc));
              }
            }
          }
        }
      }).on('complete', info => {
      }).on('paused', () => {
      }).on('error', err => {
        console.log(err);
    });
    // events
    this.db2 = new PouchDB(REMOTE_EVENT_DB, {});
    this.db2.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        if (store.getState().mapReady && change && change.doc) {
          if (change.doc._id.startsWith('Trip Start')) {
            // console.log('Trip Start - TBD');
            // console.log(change.doc);
            //store.dispatch(stopOlliTrip(change.doc));
          }
          else if (change.doc._id.startsWith('Trip Stop')) {
            // console.log('Trip Stop - TBD');
            // console.log(change.doc);
            //store.dispatch(stopOlliTrip(change.doc));
          }
          else if( change.doc.event === 'display' )
          {
              store.dispatch(ollieEvent(change.doc));
          }
        }
      }).on('complete', info => {
      }).on('paused', () => {
      }).on('error', err => {
        console.log(err);
    });
    // persona transitions
    this.db3 = new PouchDB(REMOTE_PERSONA_DB, {});
    this.db3.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        if (store.getState().mapReady && change && change.doc) {
          if (change.doc.transition === 'olli_stop_entry') {
            console.log(change.doc.persona+' enters olli stop');
            store.dispatch(updatePersonas(change.doc.persona, true));
            this.setState({patrons: true});
            // if Brent, show ASL
            if (change.doc.persona.startsWith('Brent')) {
              store.dispatch(setKinTransInUse(true));
            }
            // if Katherine, lower the screen
            if (change.doc.persona.startsWith('Katherine')) {
              // TODO show spacer element above stop name
            }
          } else if (change.doc.transition === 'olli_stop_end_exit]') {
            if (store.getState().personas.length < 2) // only 1 patron left who we're getting ready to remove them
              this.setState({patrons:false});
            store.dispatch(updatePersonas(change.doc.persona, false));
            if (change.doc.persona === 'Brent') {
              store.dispatch(setKinTransInUse(false));
            }
            if (change.doc.persona === 'Katherine') {
              // TODO hide spacer element above stop name
            }
          }
        }
      }).on('complete', info => {
      }).on('paused', () => {
      }).on('error', err => {
        console.log(err);
    });
    
    // using this for testing messages
    this.db4 = new PouchDB("http://127.0.0.1:5984/a_dummy_trigger", {});
    this.db4.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        // console.log(store.getState());
        // console.log(change.doc)
        if (store.getState().mapReady && change && change.doc) {
          console.log("dummy change");
          store.dispatch(updatePersonas("Brent", true));
          store.dispatch(setKinTransInUse(!this.state.patrons));
          this.setState({patrons:!this.state.patrons});
        }
      }).on('complete', info => {
      }).on('paused', () => {
      }).on('error', err => {
        console.log(err);
    });
  }

  render() {
    let st = store.getState();

    if (!this.state.patrons) {
      return (
        <Provider store={store}>  
          <div className="cssgrid">
            <OlliLogo />
            <StopHeader stop={this.state.stop} />
            <Map stop={this.state.stop} fullscreen={!st.kinTransInUse} />
            <Monitor />
          </div>  
        </Provider>
      );
    }

    return (
      <Provider store={store}>

        <div className="cssgrid">
          <OlliLogo />
          <StopHeader stop={this.state.stop} />
          <div className="clock-weather">
            <Clock />
            <Weather serviceurl={WEATHER_URL} refreshrate={WEATHER_REFRESH_MIN} />
          </div>
          <KinTrans />
          <Info />

          <Map stop={this.state.stop} fullscreen={!st.kinTransInUse} />
          <StopGraph />

          <POISNearby />

          <Monitor />
        </div>

      </Provider>
    );
  }
}

export default App;
