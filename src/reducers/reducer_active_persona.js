import { ADD_PERSONA, REMOVE_PERSONA } from '../actions/index'

let activePersonas = [];

export default function (state = null, action) {
  if (action) {
    switch (action.type) {
      case ADD_PERSONA:
        let activePersonaExists = false;
        for(let activePersona of activePersonas) {
          if (activePersona.name === action.persona.name) {
            activePersonaExists = true;
            break;
          }
        }
        if (activePersonas.length === 0) {
          state = action.persona;
        }
        if (! activePersonaExists) {
          activePersonas.push(action.persona)
        }
        break;
      case REMOVE_PERSONA:
        let activePersonaIndex = -1;
        for(let i=0; i<activePersonas.length; i++) {
          if (activePersonas[i].name === action.persona.name) {
            activePersonaIndex = i;
            break;
          }
        }
        if (activePersonaIndex >= 0) {
          activePersonas.splice(activePersonaIndex, 1);
          if (activePersonas.length > 0) {
            state = activePersonas[0];
          }
          else {
            state = null;
          }
        }
        break;
      default:
        break;
      }
  }
  return state;
}