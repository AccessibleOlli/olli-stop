
## send an event 

create function in actions/index.js 
in component that will send message:
  - import redux:

  ```
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  ```

  - import function above
  - map function to a local function name that will be attached to props, e.g.:

  ```
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      setDestination: setDestination
    }, dispatch);
  }
  ```

  - `export default connect(mapStateToProps, mapDispatchToProps)(classname);`


## receive an event

- create a reducer to catch the action type of function above and update the global state with its data
- create function in actions/index.js 
- in component that will send message:

  - import redux:

  ```
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  ```

  - import function above
  - map function to a local function name that will be attached to props, e.g.:

  ```
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      setDestination: setDestination
    }, dispatch);
  }
  ```

  - `export default connect(mapStateToProps, mapDispatchToProps)(classname);`



const REMOTE_DB = process.env['REACT_APP_REMOTE_DB'] || 'http://localhost:5984/ollilocation';


          <div className="bx--row">
            <div className="bx--col-xs-12 stop-panel">
              <TogglePOICategory />
            </div>
          </div>


curl "https://api.mapbox.com/directions/v5/mapbox/walking/-92.4645,44.0225;-92.466,44.024?access_token=pk.eyJ1IjoibWFwb2xsaSIsImEiOiJjajBzd25hZ2EwNTh1MzJvNW56aHkybTN3In0.ZuZ_XILook5zfWBaSFaeqg"

curl "https://api.mapbox.com/directions/v5/mapbox/walking/-92.467148454828, 44.022351687354;-92.466,44.024?access_token=pk.eyJ1IjoibWFwb2xsaSIsImEiOiJjajBzd25hZ2EwNTh1MzJvNW56aHkybTN3In0.ZuZ_XILook5zfWBaSFaeqg&overview=false&steps=true&annotations=distance"

curl "https://api.mapbox.com/directions/v5/mapbox/driving/-92.467148454828,44.022351687354;-92.466,44.024?access_token=pk.eyJ1IjoibWFwb2xsaSIsImEiOiJjajBzd25hZ2EwNTh1MzJvNW56aHkybTN3In0.ZuZ_XILook5zfWBaSFaeqg&overview=false&steps=true&annotations=distance"


onclick
select destination
call for nearby pois
present them all in gray on map
present them in info win -- clickable
