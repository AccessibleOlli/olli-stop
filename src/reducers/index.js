import { combineReducers } from 'redux';
import MapReadyReducer from './reducer_map_ready';
import OlliPositionReducer from './reducer_olli_position';
import OlliRouteReducer from './reducer_olli_route';
import OlliRouteVisibilityReducer from './reducer_olli_route_visibility';
import POICategoryReducer from './reducer_poi_category';
import POIShowReducer from './reducer_poi_show';

const rootReducer = combineReducers({
  mapReady: MapReadyReducer,
  olliPosition: OlliPositionReducer,
  olliRoute: OlliRouteReducer,
  olliRouteVisibility: OlliRouteVisibilityReducer,
  poiCategory: POICategoryReducer, 
  poiShow: POIShowReducer
});

export default rootReducer;