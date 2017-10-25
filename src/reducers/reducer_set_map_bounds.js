import { SET_MAP_BOUNDS } from '../actions/index';
import mapboxgl from 'mapbox-gl';
import route from '../route.json';

const coordinates = route.features[0].geometry.coordinates.map(coords => {
  return [coords[0], coords[1]]
});

const initalBounds = coordinates.reduce((bounds, coord) => {
  return bounds.extend(coord)
}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

export default function (state = initalBounds, action) {
  if (action) {
    switch (action.type) {
      case SET_MAP_BOUNDS:
        state = action.bounds;
        break;
      default:
        break;
    }
  }
  return state;
}