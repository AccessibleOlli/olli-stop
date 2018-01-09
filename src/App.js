import axios from 'axios';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducers from './reducers';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { setOlliRoute, setOlliPosition, startOlliTrip, endOlliTrip, setKinTransInUse, addPersona, removePersona, setDestination } from './actions/index';
import OLLI_ROUTE from './data/route.json';
import WebsocketManager from './util/websocket_manager';
import handleKinTransMessage from './util/kintrans_message_handler';
import sendSMS from './util/sms';
import Main from './main';

import { ollieEvent } from "./actions"

require('dotenv').config()
PouchDB.plugin(PouchDBFind);

const store = createStore(reducers);
const REMOTE_WS = process.env['REACT_APP_REMOTE_WS'];
const REMOTE_TELEMETRY_DB = process.env['REACT_APP_REMOTE_TELEMETRY_DB'];
const REMOTE_EVENT_DB = process.env['REACT_APP_REMOTE_EVENT_DB'];
const REMOTE_PERSONA_DB = process.env['REACT_APP_REMOTE_PERSONA_DB'];
const REMOTE_DB = process.env['REACT_APP_REMOTE_DB'] || 'https://0fdf5a9b-8632-4315-b020-91e60e1bbd2b-bluemix.cloudant.com/ollilocation';

class App extends Component {

  constructor() {
    super();
    store.dispatch(setOlliRoute(OLLI_ROUTE));
    if (REMOTE_TELEMETRY_DB && REMOTE_EVENT_DB) {
      this.startPouchDBAOSim();
    }
    else {
      this.startPouchDBOlliSim();
    }

    // if there's no CES REMOTE_TELEMETRY_DB setting fall back to use IBM cloud-based telemetry service
    if (REMOTE_WS && !REMOTE_TELEMETRY_DB) {
      this.startWebsocket();
    }

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
          else if( change.doc.event === 'sms' )
          {
            if (change.doc.payload && change.doc.payload.phone && change.doc.payload.text) {
              sendSMS(change.doc.payload.phone, change.doc.payload.text)
                .then((response) => {
                  console.log(response);
                }).catch(err => {
                  console.log(err);
                });
            } 
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
        console.log("GOT CHANGE");
        if (store.getState().mapReady && change && change.doc) {
          if (change.doc.transition === 'olli_stop_entry') {
            console.log(change.doc.persona+' enters olli stop');
            let persona = {
              name: change.doc.persona,
              preferences: change.doc.preferences
            };
            if (change.doc.persona.startsWith('Brent')) {
              persona.deaf = true;
            }
            else if (change.doc.persona.startsWith('Erich')) {
              persona.blind = true;
            }
            else if (change.doc.persona.startsWith('Grace')) {
              persona.cognitive = true;
            }
            else if (change.doc.persona.startsWith('Kathryn')) {
              persona.wheelchair = true;
            }
            store.dispatch(addPersona(persona));
          } else if (change.doc.transition === 'olli_stop_end_exit' || change.doc.transition === 'olli_stop_side_exit') {
            let persona = {
              name: change.doc.persona
            };
            //if (store.getState().personas.length < 2) // only 1 patron left who we're getting ready to remove them
              //this.setState({patrons:false});
            store.dispatch(removePersona(persona));
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
  }

  render() {
    return (
      <Provider store={store}>  
        <Main />
      </Provider>
    );
  }
}

export default App;
