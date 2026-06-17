// Preload script seguro para o Electron
const { contextBridge } = require('electron');

// Caso queira expor recursos do Node/OS para o front-end de forma segura no futuro:
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});
