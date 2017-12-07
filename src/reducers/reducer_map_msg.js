import { MAP_MSG } from '../actions/index'

export default function (state = false, action) {
  if (action) {
    switch (action.type) {
      case MAP_MSG:
        state = action.messageHtml;
        break;
      default:
        break;
    }
  }
  return state;
}