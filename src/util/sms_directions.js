import sendSMS from '../util/sms'

let TEXT_PERSONA_IF_SET = process.env['REACT_APP_TEXT_PERSONA_IF_SET'];
if (TEXT_PERSONA_IF_SET && TEXT_PERSONA_IF_SET.toLowerCase() === 'false') {
  TEXT_PERSONA_IF_SET = false;
}
const TEXT_PHONE_NUMBER = process.env['REACT_APP_TEXT_PHONE_NUMBER'];

export default function sendDirectionsSMS(poiDirections, activePersona) {
  let phone = TEXT_PHONE_NUMBER;
  if (TEXT_PERSONA_IF_SET && activePersona.preferences && activePersona.preferences.mobile_phone) {
    phone = activePersona.preferences.mobile_phone;
  }
  if (!phone) {
    return;
  }
  let directions = [];
  if (poiDirections) {
    directions = poiDirections.legs.map((leg => {
      let steps = leg.steps.map((step) => {
        let iconClassName = "directions-icon";
        if (step.modifier) {
          iconClassName += " directions-icon-" + step.modifier;
        }
        return `* ${step.instruction} ${step.distance}m`;
      });
      return `DESTINATION: ${leg.poi.name}\n` + steps.join('\n');
    }));
  }
  if (directions.length > 0) {
    let text = directions.join('\n\n');
    sendSMS(phone, text)
      .then((response) => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      });
  }
}