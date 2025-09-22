const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

// Sms module
const { sendSMS } = require('./sms');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  await mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

// Login handler
ipcMain.handle('admin-login', async (event, email, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/admin/login', {
      email,
      password,
    });

    const token = response.data.token;

    return {
      success: true,
      email: response.data.admin.email,
      token: token,
    };
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
});

// SMS listener
ipcMain.on('send-sms', (event, { phone, message }) => {
  try {
    sendSMS(phone, message);
    console.log(`SMS sent to ${phone}`);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
});
