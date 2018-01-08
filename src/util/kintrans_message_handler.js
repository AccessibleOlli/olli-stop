import { setDestination } from '../actions/index';
import DISPLAY_STOPS from '../data/display_stops.json';

export default function handleKinTransMessage(message, store) {
  let text = message.message.toLowercase();
  let messageProcessed = false;
  for (let stop of DISPLAY_STOPS) {
    if (stop.number === text) {
      store.dispatch(setDestination(stop.name));
      messageProcessed = true;
      break;
    }
  }
  if (! messageProcessed) {
    if (text == 'yes') {
      // mw:TBD - text directions
    }
  }
}