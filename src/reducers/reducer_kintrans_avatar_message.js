import { KINTRANS_AVATAR_MESSAGE } from '../actions/index'

let initialState = {
  id: 'i need help',
  message: 'i need help',
  timestamp: (new Date()).getTime()
}

export default function (state = initialState, action) {
  if (action) {
    switch (action.type) {
      case KINTRANS_AVATAR_MESSAGE:
        state = {};
        state.id = action.kintransAvatarMessage;
        state.message = action.kintransAvatarMessage;
        state.timestamp = (new Date()).getTime();
        break;
      default:
        break;
    }
  }
  return state;
}