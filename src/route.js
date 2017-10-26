//import routeData from './route.json';
//import stopData from './stops.json';
import routeData from './route2.json';
import stopData from './stops2.json';

let routeCoordinates = null;
if (routeData.features.length === 1) {
  routeCoordinates = routeData.features[0].geometry.coordinates.map(coords => {
    return [coords[0], coords[1]];
  });
}
else {
  routeCoordinates = routeData.features.map(feature => {
    return [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
  });
}

const stops = stopData.features.map(feature => {
  return {
    name: feature.properties.name,
    description: feature.properties.description,
    poi: feature.properties.poi,
    coordinates: feature.geometry.coordinates
  }
})

export function buildRoute(routeCoordinates, stopData) {
  const stops = [];
  for (let i = 0; i < routeCoordinates.length; i++) {
    for (let stop of stopData) {
      if (stop.coordinates[0] === routeCoordinates[i][0] && stop.coordinates[1] === routeCoordinates[i][1]) {
        stops.push({
          name: stop.name,
          description: stop.description,
          poi: stop.poi,
          coordinates: stop.coordinates,
          routeIndex: i
        });
        break;
      }
    }
  }
  if (stops.length === 0) {
    stops.push({
      name: 'NO STOPS',
      description: 'No matching stops',
      coordinates: routeCoordinates[0],
      routeIndex: 0
    });
  }

  const points = [];
  let pointCount = routeCoordinates.length;
  let previousStop = stops[stops.length - 1];
  let previousStopIndex = stops.length - 1;
  let progress = 0;
  for (let i = 0; i < pointCount; i++) {
    let currentStop = null;
    let currentStopIndex = -1;
    for (let j = 0; j < stops.length; j++) {
      if (stops[j].coordinates[0] === routeCoordinates[i][0] && stops[j].coordinates[1] === routeCoordinates[i][1]) {
        currentStopIndex = j;
        currentStop = stops[j];
        break;
      }
    }
    let nextStop = null;
    if (currentStopIndex > -1) {
      progress = 0;
      if (stops.length > (currentStopIndex + 1)) {
        nextStop = stops[currentStopIndex + 1];
      }
      else {
        nextStop = stops[0];
      }
    }
    else {
      if (stops.length > (previousStopIndex + 1)) {
        nextStop = stops[previousStopIndex + 1];
        progress = 1 - ((nextStop.routeIndex - i) / (nextStop.routeIndex - previousStop.routeIndex));
      }
      else {
        nextStop = stops[0];
        if (i < nextStop.routeIndex) {
          progress = ((pointCount - previousStop.routeIndex + i) / (pointCount - previousStop.routeIndex + nextStop.routeIndex));
        }
        else {
          progress = 1 - ((pointCount - i) / (pointCount - previousStop.routeIndex));
        }
      }
    }
    points.push({
      coordinates: routeCoordinates[i],
      currentStop: currentStop,
      previousStop: previousStop,
      nextStop: nextStop,
      nextStopProgress: progress
    });
    if (currentStopIndex > -1) {
      previousStopIndex = currentStopIndex;
      previousStop = currentStop;
    }
  }
  return {
    points: points,
    stops: stops
  };
}

export default buildRoute(routeCoordinates, stops);