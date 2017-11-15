import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducers from './reducers';
import Buttons from './components/buttons';
import Map from './components/map';
import Progress from './components/progress';
import TogglePOICategory from './components/toggle_poi_category';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { setOlliRoute, setOlliPosition, startOlliTrip, endOlliTrip } from './actions/index'

PouchDB.plugin(PouchDBFind  );

const store = createStore(reducers);

class App extends Component {

  constructor() {
    super();
    this.db = new PouchDB('https://9f61849d-2884-4463-8888-56344789b05c-bluemix:3f660ce74468abc372307569838d83d10ac1cff70dea31d5f1499e284e98795a@9f61849d-2884-4463-8888-56344789b05c-bluemix.cloudant.com/ollilocation', {});
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
          <div className="bx--row protoui">
            <div className="stopplacard bx--col-xs-12">
                <h1 className="stopname">Peace Plaza</h1>
            </div>
          </div>


          <div className="bx--row protoui">
            <div className="bx--col-xs-4 protoui">
              <TogglePOICategory />
            </div>
            <div className="bx--col-xs-4 protoui">UI is fun</div>
            <div className="bx--col-xs-4 protoui">UI is fun</div>
          </div>

          <div className="bx--row protoui">
            <div className="instructions bx--col-xs-8 protoui">Instructional messages go here...</div>
            <Map />
            <div className="bx--col-xs-4 fakebg protoui">
              <Buttons />
              <Progress />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
