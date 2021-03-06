import { combineReducers } from 'redux';
import MapReadyReducer from './reducer_map_ready';
import OlliPositionReducer from './reducer_olli_position';
import OlliPositionsReducer from './reducer_olli_positions';
import OlliRouteReducer from './reducer_olli_route';
import OlliRouteVisibilityReducer from './reducer_olli_route_visibility';
import POICategoryReducer from './reducer_poi_category';
import POIDirectionsReducer from './reducer_poi_directions';
import POIsReducer from './reducer_pois';
import POIsSelectedReducer from './reducer_pois_selected';
import MapMsgReducer from './reducer_map_msg';
import setDestinationReducer from './reducer_set_destination';
import KinTransAvatarMessageReducer from './reducer_kintrans_avatar_message';
import KinTransInUseReducer from './reducer_kintrans_in_use';
import ActivePersonaReducer from './reducer_active_persona';
import ActivePersonaTypesReducer from './reducer_active_persona_types';
import displayReducer from './displayReducer';

const rootReducer = combineReducers({
  mapReady: MapReadyReducer,
  olliPosition: OlliPositionReducer,
  olliPositions: OlliPositionsReducer,
  olliRoute: OlliRouteReducer,
  olliRouteVisibility: OlliRouteVisibilityReducer,
  mapMsg: MapMsgReducer,
  destinationStopName: setDestinationReducer,
  pois: POIsReducer,
  poiCategory: POICategoryReducer,
  selectedPOIs: POIsSelectedReducer,
  poiDirections: POIDirectionsReducer,
  kintransAvatar: KinTransAvatarMessageReducer, 
  kinTransInUse: KinTransInUseReducer,
  activePersona: ActivePersonaReducer,
  activePersonaTypes: ActivePersonaTypesReducer,
  display: displayReducer
});

export default rootReducer;