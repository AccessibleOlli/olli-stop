import { SET_OLLI_POSITION, SET_OLLI_ROUTE, START_OLLI_TRIP, END_OLLI_TRIP } from '../actions/index'

let olliRoute = null;

export default function (state = null, action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_ROUTE:
        olliRoute = action.route;
        break;
      case START_OLLI_TRIP:
        if (olliRoute) {
          state = {
            coordinates: action.coordinates,
            currentStop: null,
            previousStop: action.fromStop,
            nextStop: action.toStop,
            nextStopProgress: 0.0,
            distanceRemaining: action.distanceRemaining
          };
        }
        break;
      case END_OLLI_TRIP:
        if (olliRoute) {
          state = {
            coordinates: action.coordinates,
            currentStop: action.toStop,
            previousStop: action.fromStop,
            nextStop: null,
            nextStopProgress: 1.0,
            distanceRemaining: action.distanceRemaining
          };
        }
        break;
      case SET_OLLI_POSITION:
        if (olliRoute && state) {
          state = {
            position: action.position, 
            coordinates: action.coordinates,
            currentStop: state.currentStop,
            previousStop: state.previousStop,
            nextStop: state.nextStop,
            nextStopProgress: action.progress,
            distanceRemaining: action.distanceRemaining
          }
        }
        break;
      default:
        break;
    }
  }
  return state;
}