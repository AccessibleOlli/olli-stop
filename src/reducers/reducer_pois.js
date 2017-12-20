import { DESTINATION_NAME, SET_POIS, SELECT_POI, DESELECT_POI } from '../actions/index'

export default function (state = null, action) {
  if (action) {
    let matchingPOIs = undefined;
    switch (action.type) {
      case DESTINATION_NAME:
        // reset on new destination
        state = null;
        break;
      case SET_POIS:
        state = action.pois;
        break;
      case SELECT_POI:
        matchingPOIs = state.filter((poi) => {
          return poi.id === action.poi.id && ! poi.selected;
        });
        if (matchingPOIs.length > 0) {
          matchingPOIs.forEach((matchingPOI) => {
            matchingPOI.selected = true;
          });
          state = state.slice(0);
        }
        break;
      case DESELECT_POI:
        matchingPOIs = state.filter((poi) => {
          return poi.id === action.poi.id && poi.selected;
        });
        if (matchingPOIs.length > 0) {
          matchingPOIs.forEach((poi) => {
            poi.selected = false;
          });
          state = state.slice(0);
        }
        break;
      default:
        break;
    }
  }
  return state;
}