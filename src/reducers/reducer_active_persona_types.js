import { ADD_PERSONA, REMOVE_PERSONA } from '../actions/index'

let defaultPersonaTypes = {
  deaf: false,
  blind: false,
  cognitive: false,
  wheelchair: false
}
let activePersonas = [];

export default function (state = defaultPersonaTypes, action) {
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
        if (! activePersonaExists) {
          activePersonas.push(action.persona);
          let personaTypeChange = (
            (action.persona.deaf && ! state.deaf) ||
            (action.persona.blind && ! state.blind) ||
            (action.persona.cognitive && ! state.cognitive) ||
            (action.persona.wheelchair && ! state.wheelchair)
          );
          if (personaTypeChange) {
            state = {
              deaf: (state.deaf===true) || (action.persona.deaf===true),
              blind: (state.blind===true) || (action.persona.blind===true),
              cognitive: (state.cognitive===true) || (action.persona.cognitive===true),
              wheelchair: (state.wheelchair===true) || (action.persona.wheelchair===true),
            }
          }
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
          state = {
            deaf: false,
            blind: false,
            cognitive: false,
            wheelchair: false
          }
          if (activePersonas.length > 0) {
            for (let activePersona of activePersonas) {
              state.deaf = (state.deaf===true) || (activePersona.deaf===true);
              state.blind = (state.blind ===true)|| (activePersona.blind===true);
              state.cognitive = (state.cognitive===true) || (activePersona.cognitive===true);
              state.wheelchair = (state.wheelchair===true) || (activePersona.wheelchair===true);
            }
          }
        }
        break;
      default:
        break;
      }
  }
  return state;
}