import { SET_OLLI_POSITION } from '../actions/index'
import route from '../route'

let initialPosition = route.points[0];

export default function (state = initialPosition, action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_POSITION:
        state = action.point;
        break;
      default:
        break;
    }
  }
  return state;
}