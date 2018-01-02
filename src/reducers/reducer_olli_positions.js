import { SET_OLLI_POSITION } from '../actions/index'

export default function (state = [], action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_POSITION:
        let matchingPositions = state.filter((position) => {
          return position.olliId === action.position.olliId;
        });
        let positions = undefined;
        if (matchingPositions.length === 0) {
          positions = state.slice(0);
        }
        else {
          positions = state.slice();
        }
        positions.push({
          olliId: action.position.olliId, 
          coordinates: action.coordinates,
        });
        state = positions;
      default:
        break;
    }
  }
  return state;
}