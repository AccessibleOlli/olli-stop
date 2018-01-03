import { setDestination } from '../actions/index';
import DISPLAY_STOPS from '../data/display_stops.json';

export default function handleKinTransMessage(message, store) {
  let messageProcessed = false;
  for (let stop of DISPLAY_STOPS) {
    if (stop.number === message.message) {
      store.dispatch(setDestination(stop.name));
      messageProcessed = true;
      break;
    }
  }
}