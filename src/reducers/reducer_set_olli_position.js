import { SET_OLLI_POSITION } from '../actions/index'

let initialPosition = {
	'type': 'FeatureCollection',
	'features': [{
		'type': 'Feature',
		'geometry': {
			'type': 'Point',
			'coordinates': [-92.467044, 44.022365]
		}
	}]
};

export default function (state = initialPosition, action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_POSITION:
        state = action.position;
        break;
      default:
        break;
    }
  }
  return state;
}