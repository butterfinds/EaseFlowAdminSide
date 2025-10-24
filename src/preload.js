const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ✅ Login bridge
  login: (email, password) => ipcRenderer.invoke('admin-login', email, password),

  // ✅ SMS bridge (CHANGED to invoke)
  sendSMS: (phone, message) => ipcRenderer.invoke('send-sms', { phone, message })
});