const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ✅ Login bridge
  login: (email, password) => ipcRenderer.invoke('admin-login', email, password),

  // ✅ SMS bridge
  sendSMS: (phone, message) => ipcRenderer.send('send-sms', { phone, message })
});
