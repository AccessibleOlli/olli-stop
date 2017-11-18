import { FOUND_POIS } from '../actions/index'

export default function (state = false, action) {
  if (action) {
    switch (action.type) {
      case FOUND_POIS:
        state = action.pois;
        break;
      default:
        break;
    }
  }
  return state;
}