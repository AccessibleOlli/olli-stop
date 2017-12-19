import { DESTINATION_NAME, SET_POI_DIRECTIONS } from '../actions/index'

export default function (state = null, action) {
  if (action) {
    switch (action.type) {
      case DESTINATION_NAME:
        // reset on new destination
        state = null;
        break;
      case SET_POI_DIRECTIONS:
        state = action.poiDirections;
        break;
      default:
        break;
    }
  }
  return state;
}