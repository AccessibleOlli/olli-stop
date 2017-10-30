import { combineReducers } from 'redux';
import MapReadyReducer from './reducer_map_ready';
import OlliPositionReducer from './reducer_olli_position';
import OlliRouteReducer from './reducer_olli_route';
import OlliRouteVisibilityReducer from './reducer_olli_route_visibility';

const rootReducer = combineReducers({
  mapReady: MapReadyReducer,
  olliPosition: OlliPositionReducer,
  olliRoute: OlliRouteReducer,
  olliRouteVisibility: OlliRouteVisibilityReducer
});

export default rootReducer;