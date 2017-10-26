import { SET_OLLI_POSITION, SET_OLLI_ROUTE } from '../actions/index'

let ollieRoute = null;
let lastPoint = null;

export default function (state = null, action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_ROUTE:
        ollieRoute = action.route;
        break;
      case SET_OLLI_POSITION:
        if (ollieRoute) {
          let coordinates = action.point;
          for (let point of ollieRoute.points) {
            if (! lastPoint) {
              lastPoint = point;
            }
            if (point.coordinates[0] === coordinates[0] && point.coordinates[1] === coordinates[1]) {
              lastPoint = point;
              break;
            }
          }
          state = {
            coordinates: coordinates,
            currentStop: lastPoint.currentStop,
            previousStop: lastPoint.previousStop,
            nextStop: lastPoint.nextStop,
            nextStopProgress: lastPoint.nextStopProgress
          }
        }
        break;
      default:
        break;
    }
  }
  return state;
}