export const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';
export const SET_OLLI_ROUTE = 'SET_OLLI_ROUTE';
export const SET_OLLI_ROUTE_VISIBILITY = 'SET_OLLI_ROUTE_VISIBILITY';
export const SET_OLLI_POSITION = 'SET_OLLI_POSITION';

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

export function setOlliPosition(position) {
  return {
    type: SET_OLLI_POSITION,
    position: position
  };
}
