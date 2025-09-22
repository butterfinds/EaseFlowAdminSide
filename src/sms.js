const axios = require('axios');

async function sendSMS(to, message) {
  try {
    const response = await axios.post('https://textbelt.com/text', {
      phone: to,
      message: message,
      key: 'textbelt', // free key, limited to 1 SMS/day
    });

    if (response.data.success) {
      console.log(`SMS sent to ${to}`);
    } else {
      console.error('SMS failed:', response.data.error);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

module.exports = { sendSMS };
