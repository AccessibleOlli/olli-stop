import { DESTINATION_NAME, SELECT_POI, DESELECT_POI } from '../actions/index'

export default function (state = [], action) {
  if (action) {
    let matchingPOIs = undefined;
    switch (action.type) {
      case DESTINATION_NAME:
        // reset on new destination
        state = [];
        break;
      case SELECT_POI:
        matchingPOIs = state.filter((poi) => {
          return poi.id === action.poi.id;
        });
        if (matchingPOIs.length === 0) {
          let pois = state.slice(0);
          pois.push(action.poi);
          state = pois;
        }
        break;
      case DESELECT_POI:
        matchingPOIs = state.filter((poi) => {
          return poi.id === action.poi.id;
        });
        if (matchingPOIs.length > 0) {
          let pois = state.slice(0);
          matchingPOIs.forEach((poi) => {
            pois.pop(poi);
          })
          state = pois;
        }
        break;
      default:
        break;
    }
  }
  return state;
}