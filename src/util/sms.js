import axios from 'axios';

export default function sendSMS(phoneNumber, text) {
    let phone = phoneNumber;
    if (! phone) {
      return;
    }
    phone = phone.replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '');
    if (! phone.startsWith('+')) {
      if (! phone.startsWith('1')) {
        phone = '1' + phone;
      }
      phone = '+' + phone;
    }
    return axios({
        method: 'POST',
        url: '/api/text',
        data: {
            phoneNumber: phone,
            text: text
        }
    });
  }