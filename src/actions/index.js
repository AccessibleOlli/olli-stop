import { createAction } from 'redux-actions';

export const SET_MAP_READY = 'SET_MAP_READY';
export const SET_OLLI_POSITION = 'SET_OLLI_POSITION';
export const SET_OLLI_ROUTE = 'SET_OLLI_ROUTE';
export const SET_OLLI_ROUTE_VISIBILITY = 'SET_OLLI_ROUTE_VISIBILITY';
export const START_OLLI_TRIP = 'START_OLLI_TRIP';
export const END_OLLI_TRIP = 'END_OLLI_TRIP';
export const SET_POI_CATEGORY = 'SET_POI_CATEGORY';
export const SET_POIS = 'SET_POIS';
export const SELECT_POI = 'SELECT_POI';
export const DESELECT_POI = 'DESELECT_POI';
export const SET_POI_DIRECTIONS = 'SET_POI_DIRECTIONS';
export const MAP_MSG = 'MAP_MSG';
export const DESTINATION_NAME = 'DESTINATION_NAME';
export const KINTRANS_USE = 'KINTRANS_USE';
export const KINTRANS_AVATAR_MESSAGE = 'KINTRANS_AVATAR_MESSAGE';
export const ADD_PERSONA = 'ADD_PERSONA';
export const REMOVE_PERSONA = 'REMOVE_PERSONA';

export const ollieEvent = createAction( "OLLIE_EVENT" )
export const deleteMessage = createAction( 'DELETE_MESSAGE')

export const createOllieEvent = (event) => {
    return (dispatch) => {
        if(event.payload.device.split(',').includes(process.env.REACT_APP_MONITOR))
        {
            dispatch(ollieEvent(event))
        }
    }
}

export function setMapReady(ready) {
  return {
    type: SET_MAP_READY,
    ready: ready
  };
}

export function setOlliRoute(routeInfo) {
  return {
    type: SET_OLLI_ROUTE,
    route: routeInfo
  };
}

export function setOlliRouteVisibility(visibility) {
  return {
    type: SET_OLLI_ROUTE_VISIBILITY,
    visibility: visibility
  };
}

export function setOlliPosition(geoPosition) {
  return {
    type: SET_OLLI_POSITION,
    position: geoPosition, 
    coordinates: geoPosition.coordinates,
    progress: geoPosition.distance_travelled / (geoPosition.distance_travelled + geoPosition.distance_remaining),
    distanceRemaining: geoPosition.distance_remaining
  };
}

export function startOlliTrip(tripStart) {
  return {
    type: START_OLLI_TRIP,
    coordinates: tripStart.from_coordinates,
    fromStop: tripStart.from_stop,
    toStop: tripStart.to_stop
  };
}

export function endOlliTrip(tripEnd) {
  return {
    type: END_OLLI_TRIP,
    coordinates: tripEnd.to_coordinates,
    fromStop: tripEnd.from_stop,
    toStop: tripEnd.to_stop
  };
}

export function setPOICategory(category) {
  return {
    type: SET_POI_CATEGORY,
    category: category
  };
}

export function setPOIs(pois) {
  return {
    type: SET_POIS,
    pois: pois
  };
}

export function selectPOI(poi) {
  return {
    type: SELECT_POI,
    poi: poi
  };
}

export function deselectPOI(poi) {
  return {
    type: DESELECT_POI,
    poi: poi
  };
}

export function setPOIDirections(poiDirections) {
  return {
    type: SET_POI_DIRECTIONS,
    poiDirections: poiDirections
  };
}

export function mapMessage(html, poiNames) {
  return {
    type: MAP_MSG,
    messageHtml: html, 
    poiNames: poiNames
  };
}

export function setDestination(stopname) {
  return {
    type: DESTINATION_NAME, 
    destinationStopName: stopname
  };
}

export function setKinTransAvatarMessage(msg) {
  return {
    type: KINTRANS_AVATAR_MESSAGE,
    kintransAvatarMessage: msg
  }
}

export function setKinTransInUse(tf) {
  return {
    type: KINTRANS_USE, 
    kinTransInUse: tf
  }
}

export function addPersona(persona) {
  return {
    type: ADD_PERSONA, 
    persona: persona
  }
}

export function removePersona(persona) {
  return {
    type: REMOVE_PERSONA, 
    persona: persona
  }
}