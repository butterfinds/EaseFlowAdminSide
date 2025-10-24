const axios = require('axios');

async function sendSMS(to, message) {
  // --- START OF PHONE NUMBER LOGIC ---
  let phoneNumber = String(to).trim();

  if (phoneNumber.startsWith('0') && phoneNumber.length === 11) {
    phoneNumber = '+63' + phoneNumber.substring(1);
  } else if (phoneNumber.startsWith('69') && phoneNumber.length === 12) {
    phoneNumber = '+63' + phoneNumber.substring(2);
  } else if (phoneNumber.length === 10 && (phoneNumber.startsWith('9') || phoneNumber.startsWith('8'))) {
    phoneNumber = '+63' + phoneNumber;
  }
  // --- END OF PHONE NUMBER LOGIC ---

  try {
    const response = await axios.post('https://textbelt.com/text', {
      phone: phoneNumber,
      message: message,
      key: 'c79beec709c77c5895a9867fc93e0cc2a536c526eg0fiudgdbj9qnwbEVAlFgFW8',
      // --- THIS IS THE NEW LINE ---
      sender: 'EasePrint', // Or whatever you want your business name to be
    });

    if (response.data.success) {
      console.log(`✅ REAL SUCCESS: SMS sent to ${phoneNumber}`);
      return { success: true, phone: phoneNumber };
    } else {
      console.error(`❌ REAL ERROR: SMS failed for ${phoneNumber}:`, response.data.error);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error('❌ CRITICAL SMS ERROR:', error.response ? error.response.data : error.message);
    return { success: false, error: error.response ? error.response.data : error.message };
  }
}

module.exports = { sendSMS };
