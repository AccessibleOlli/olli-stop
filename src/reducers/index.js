import { combineReducers } from 'redux';
import OlliPositionReducer from './reducer_olli_position';
import OlliRouteVisibilityReducer from './reducer_olli_route_visibility';

const rootReducer = combineReducers({
  olliRouteVisibility: OlliRouteVisibilityReducer,
  olliPosition: OlliPositionReducer
});

export default rootReducer;