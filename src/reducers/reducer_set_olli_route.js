import { SET_OLLI_ROUTE } from '../actions/index'
import route from '../route.json'

const coordinates = route.features[0].geometry.coordinates.map(coords => {
  return [coords[0], coords[1]]
});

let initalRoute = {
  'type': 'FeatureCollection',
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': coordinates
    }
  }]
};

export default function (state = initalRoute, action) {
  if (action) {
    switch (action.type) {
      case SET_OLLI_ROUTE:
        state = action.route;
        break;
      default:
        break;
    }
  }
  return state;
}