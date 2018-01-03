import { KINTRANS_USE } from '../actions/index'

export default function (state = false, action) {
  if (action) {
    switch (action.type) {
      case KINTRANS_USE:
        state = action.kinTransInUse;
        break;
      default:
        break;
    }
  }
  return state;
}