import { UPDATE_PERSONAS } from '../actions/index'

export default function (state = [], action) {
  if (action) {
    switch (action.type) {
      case UPDATE_PERSONAS:
        for(let i=1;i<state.length;i++) {
          if (state[i].name === action.personas.name) {
            state[i].isInside = action.personas.isInside;
            return state;
          }
        }
        return [
          ...state, 
          {
            "name": action.personas.name, 
            isInside: action.personas.isInside
          }
        ]
      default:
        break;
    }
  }
  return state;
}