import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducers from './reducers';
import Clock from './components/clock';
import Talk from './components/talk';
import Map from './components/map';
import Progress from './components/progress';
import Info from './components/info';
import Arrival from './components/arrival';
import CallBus from './components/callbus';
import StopHeader from './components/stop_header';
import TogglePOICategory from './components/toggle_poi_category';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { setOlliRoute, setOlliPosition, startOlliTrip, endOlliTrip } from './actions/index'

require('dotenv').config()
PouchDB.plugin(PouchDBFind);

const store = createStore(reducers);
const REMOTE_DB = process.env['REACT_APP_REMOTE_DB'] || 'https://0fdf5a9b-8632-4315-b020-91e60e1bbd2b-bluemix.cloudant.com/ollilocation';

class App extends Component {

  constructor() {
    super();
    this.db = new PouchDB(REMOTE_DB, {});
    this.changes = this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on('change', change => {
        if (store.getState().mapReady && change && change.doc && change.doc.type) {
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
            if (! store.getState().ollieRoute) {
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

  render() {
    return (
      <Provider store={store}>
        <div className="bx--grid top-level-container">
          <div className="bx--row">
            <div className="stopplacard bx--col-xs-12">
                <StopHeader />
            </div>
          </div>

          <div className="bx--row">
            <div className="instructions bx--col-xs-12"></div>
          </div>

          <div className="bx--row">
            <div className="bx--col-xs-8">
              <TogglePOICategory />
            </div>
            <div className="bx--col-xs-2">
              <Arrival />
            </div>
            <div className="bx--col-xs-2">
              <Clock />
            </div>
          </div>

          <div className="bx--row">
            <div className="bx--col-xs-8">
              <Map />
            </div>
            <div className="bx--col-xs-4">
              <div className="bx--row">
                <div className="bx--col-xs-6">
                  <Talk />
                </div>
                <div className="bx--col-xs-6">
                  <CallBus />
                </div>
              </div>
              <div className="bx--row">
                <div className="bx--col-xs-12">
                  <div className="stop-panel" style={{height:'450px'}}>
                    <Progress />
                    <Info />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
