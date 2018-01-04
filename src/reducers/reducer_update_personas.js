import { UPDATE_PERSONAS } from '../actions/index'

export default function (state = [], action) {
  console.log(action);
  if (action) {
    switch (action.type) {
      case UPDATE_PERSONAS:
        let newstate = [];
        for(let i=0;i<state.length;i++) {
          if (state[i].name !== action.personas.name) {
            newstate.push(state[i]);
          }
        }
        newstate.push({
          name: action.personas.name, 
          isInside: action.personas.isInside
        });
        return newstate;
        // return [
        //   ...newstate, 
        //   {
        //     name: action.personas.name, 
        //     isInside: action.personas.isInside
        //   }
        // ]
      default:
        break;
    }
  }
  return state;
}