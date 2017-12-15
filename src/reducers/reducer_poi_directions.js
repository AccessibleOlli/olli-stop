import { SET_POI_DIRECTIONS } from '../actions/index'

export default function (state = null, action) {
  if (action) {
    switch (action.type) {
      case SET_POI_DIRECTIONS:
        state = action.poiDirections;
        break;
      default:
        break;
    }
  }
  return state;
}