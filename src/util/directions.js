import axios from 'axios';

const THIS_STOP = [-92.467148454828,44.022351687354];
const mapboxglaccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
var mapboxdirections = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving'
});

export default function(pois) {
    let dirurl = "/"+THIS_STOP[0]+","+THIS_STOP[1];
    pois.forEach((poi) => {
      dirurl += ";" + poi.coordinates.longitude + "," + poi.coordinates.latitude;
    });
    dirurl += "?access_token="+mapboxglaccessToken+"&overview=false&steps=true&annotations=distance";
    return mapboxdirections.get(dirurl)
      .then(response => {
        let i = -1;
        let legs = response.data.routes[0].legs.map((leg) => {
          let poi = pois[++i];
          let steps = leg.steps.map((step) => {
            let d = step.maneuver.instruction;
            return {
              instruction: d,
              modifier: step.maneuver.modifier,
              distance: step.distance
            };
          });
          return {
            poi: poi,
            steps: steps
          };
        });
        return { legs: legs };
    });
}