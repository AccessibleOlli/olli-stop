import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducers from './reducers';
import Buttons from './components/buttons';
import Map from './components/map';

const store = createStore(reducers);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Map />
          <Buttons />
        </div>
      </Provider>
    );
  }
}

export default App;
