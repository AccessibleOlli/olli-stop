import routeData from './route.json';
import stopData from './stops.json';

const stops = [];
for (let i=0; i<routeData.features[0].geometry.coordinates.length; i++) {
    let routeCoordinates = [routeData.features[0].geometry.coordinates[i][0], routeData.features[0].geometry.coordinates[i][1]];
    for (let feature of stopData.features) {
        let stopCoordinates = feature.geometry.coordinates;
        if (stopCoordinates[0] === routeCoordinates[0] && stopCoordinates[1] === routeCoordinates[1]) {
            stops.push({
                name: feature.properties.name,
                description: feature.properties.description,
                coordinates: stopCoordinates,
                routeIndex: i
            });
            break;
        }
    }
}

const points = [];
let pointCount = routeData.features[0].geometry.coordinates.length;
let previousStop = stops[stops.length - 1];
let previousStopIndex = stops.length - 1;
let progress = 0;
for (let i=0; i<pointCount; i++) {
    let coordinates = [routeData.features[0].geometry.coordinates[i][0], routeData.features[0].geometry.coordinates[i][1]];
    let currentStop = null;
    let currentStopIndex = -1;
    for (let j=0; j<stops.length; j++) {
        if (stops[j].coordinates[0] === coordinates[0] && stops[j].coordinates[1] === coordinates[1]) {
            currentStopIndex = j;
            currentStop = stops[j];
            break;
        }
    }
    let nextStop = null;
    if (currentStopIndex > -1) {
        progress = 0;
        if (stops.length > (currentStopIndex+1)) {
            nextStop = stops[currentStopIndex+1];
        }
        else {
            nextStop = stops[0];
        }
    }
    else {
        if (stops.length > (previousStopIndex+1)) {
            nextStop = stops[previousStopIndex+1];
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
        coordinates: coordinates,
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

export default {
    points: points,
    stops: stops
}