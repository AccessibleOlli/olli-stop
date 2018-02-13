import { setDestination } from '../actions/index';
import sendDirectionsSMS from '../util/sms_directions';
import DISPLAY_STOPS from '../data/display_stops.json';

export default function handleKinTransMessage(message, store) {
  console.log('handleKinTransMessage');
  console.log(message);
  let text = message.response.toLowerCase();
  let messageProcessed = false;
  for (let stop of DISPLAY_STOPS) {
    if (stop.number === text) {
      if (! store.getState().destinationStopName) {
        store.dispatch(setDestination(stop.name));
      }
      messageProcessed = true;
      break;
    }
  }
  if (! messageProcessed) {
    if (text == 'yes') {
      if (store.getState().poiDirections && store.getState().activePersona) {
        // user signed yes and directions are showing and someone is in the stop
        sendDirectionsSMS(store.getState().poiDirections, store.getState().activePersona);
      }
      messageProcessed = true;
    }
  }
}