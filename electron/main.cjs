const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

// Registrar o esquema "app" como seguro e padrão (necessário para suportar ES Modules via CORS)
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
]);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true
    },
    // Visual Premium: Barra de título integrada com a janela e o tema escuro (slate-900)
    title: 'Lista de Tarefas',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#f8fafc',
      height: 40
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Abre as ferramentas de desenvolvedor apenas no modo de desenvolvimento
    mainWindow.webContents.openDevTools();
    // Encaminha mensagens do console do frontend para o terminal no modo de desenvolvimento
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`[FRONTEND CONSOLE] [Level ${level}] ${message} (${sourceId}:${line})`);
    });
  } else {
    mainWindow.loadURL('app://./index.html');
  }

  // Prevenir que links externos abram dentro da janela do app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      const { shell } = require('electron');
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Configurações de segurança recomendadas pelo Electron
app.enableSandbox();

app.whenReady().then(() => {
  // Configurar o protocolo "app" para servir os arquivos estáticos da pasta dist (evita bloqueio de CORS de ES Modules)
  protocol.handle('app', (request) => {
    try {
      const url = new URL(request.url);
      let filePath = url.pathname;
      if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
      }
      const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const resolvedPath = path.join(__dirname, '../dist', cleanPath);
      return net.fetch(pathToFileURL(resolvedPath).toString());
    } catch (error) {
      console.error('Erro no manipulador do protocolo app://:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
