import { DESTINATION_NAME } from '../actions/index'

export default function (state = false, action) {
  if (action) {
    switch (action.type) {
      case DESTINATION_NAME:
        state = action.destinationStopName;
        break;
      default:
        break;
    }
  }
  return state;
}