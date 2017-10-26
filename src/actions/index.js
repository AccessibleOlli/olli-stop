export const SET_OLLI_ROUTE_VISIBILITY = 'SET_OLLI_ROUTE_VISIBILITY';
export const SET_OLLI_POSITION = 'SET_OLLI_POSITION';

export function setOlliRouteVisibility(visibility) {
  return {
    type: SET_OLLI_ROUTE_VISIBILITY,
    visibility: visibility
  };
}

export function setOlliPosition(point) {
  return {
    type: SET_OLLI_POSITION,
    point: point
  };
}
