export const SET_MAP_READY = 'SET_MAP_READY';
export const SET_OLLI_POSITION = 'SET_OLLI_POSITION';
export const SET_OLLI_ROUTE = 'SET_OLLI_ROUTE';
export const SET_OLLI_ROUTE_VISIBILITY = 'SET_OLLI_ROUTE_VISIBILITY';

export function setMapReady(ready) {
  return {
    type: SET_MAP_READY,
    ready: ready
  };
}

export function setOlliPosition(point) {
  return {
    type: SET_OLLI_POSITION,
    point: point
  };
}

export function setOlliRoute(route) {
  return {
    type: SET_OLLI_ROUTE,
    route: route
  };
}

export function setOlliRouteVisibility(visibility) {
  return {
    type: SET_OLLI_ROUTE_VISIBILITY,
    visibility: visibility
  };
}