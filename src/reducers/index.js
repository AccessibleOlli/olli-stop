import { combineReducers } from 'redux';
import SetMapBoundsReducer from './reducer_set_map_bounds';
import SetOlliPositionReducer from './reducer_set_olli_position';
import SetOlliRouteReducer from './reducer_set_olli_route';
import SetOlliRouteVisibilityReducer from './reducer_set_olli_route_visibility';

const rootReducer = combineReducers({
  mapBounds: SetMapBoundsReducer,
  olliRoute: SetOlliRouteReducer,
  olliRouteVisibility: SetOlliRouteVisibilityReducer,
  olliPosition: SetOlliPositionReducer
});

export default rootReducer;