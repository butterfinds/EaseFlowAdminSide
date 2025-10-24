const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const axios = require('axios'); // Removed from here
// const { sendSMS } = require('./sms'); // Removed from here

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

// Login handler
ipcMain.handle('admin-login', async (event, email, password) => {
  // --- Optimization: Lazy-load axios ---
  const axios = require('axios');

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
// CHANGE from ipcMain.on to ipcMain.handle
ipcMain.handle('send-sms', async (event, { phone, message }) => {
  // --- Optimization: Lazy-load sms module ---
  const { sendSMS } = require('./sms');

  try {
    // We 'await' the result from sendSMS
    const result = await sendSMS(phone, message);
    return result; // Send the real result back to the HTML
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, error: error.message };
  }
});

// Add this new function
function setActiveSidebarLink(activeId) {
    // Remove 'active-link' class from all links first
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active-link');
         // Ensure default styles are reapplied if needed (Tailwind handles this mostly)
         link.classList.add('text-gray-300'); // Ensure default text color
         link.style.paddingLeft = '1rem'; // Reset padding
    });

    // Add 'active-link' class to the currently active link
    const activeLink = document.querySelector(`.sidebar-link[data-section="${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active-link');
         activeLink.classList.remove('text-gray-300'); // Ensure default text color is removed
         // The padding adjustment is now handled by the CSS rule
    }
}

// Ensure the correct link is active when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Find which section is initially visible (if not 'home')
    let initialSectionId = 'home'; // Default
    const visibleSection = document.querySelector('.main > div:not(.hidden)');
    if (visibleSection) {
        initialSectionId = visibleSection.id || 'home';
    }

    // If no section is visible initially, explicitly show 'home'
    if (!visibleSection) {
         const homeSection = document.getElementById('home');
         if (homeSection) homeSection.classList.remove('hidden');
    }

    setActiveSidebarLink(initialSectionId);

    // Keep the rest of your DOMContentLoaded code
    // e.g., fetchOrders(); initializeCalendar(); updateClock(); etc.
});