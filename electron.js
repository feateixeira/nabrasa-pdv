const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    try {
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            },
            icon: path.join(__dirname, 'assets/logo.ico')
        });

        mainWindow.loadFile('index.html');

        //mainWindow.webContents.openDevTools();

        mainWindow.on('closed', function () {
            mainWindow = null;
        });

        mainWindow.on('error', function (error) {
            console.error('Erro na janela principal:', error);
        });
    } catch (error) {
        console.error('Erro ao criar janela:', error);
    }
}

app.whenReady().then(createWindow).catch(error => {
    console.error('Erro ao iniciar aplicativo:', error);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// Manipulador para impressão
ipcMain.on('print-order', async (event, data) => {
    try {
        // Carregar CSS de impressão dinamicamente
        await mainWindow.webContents.executeJavaScript(`
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './print.css';
            link.media = 'all';
            document.head.appendChild(link);
        `);

        setTimeout(() => {
            mainWindow.webContents.print({
                silent: true, // Para testar, mude para true em produção
                printBackground: true,
                pageSize: { width: 80 * 1000 / 254, height: 297 * 1000 / 254 },
                margins: { marginType: 'none' },
                copies: 1,
                color: false
            }, (success, errorType) => {
                if (!success) {
                    console.error('Erro na impressão:', errorType);
                }
            });
        }, 500);
    } catch (error) {
        console.error('Erro ao processar impressão:', error);
    }
});



// Manipulador para download de arquivos
ipcMain.on('download-file', (event, data) => {
    try {
        mainWindow.webContents.downloadURL(data.url, (event, downloadItem) => {
            downloadItem.setSavePath(path.join(app.getPath('downloads'), data.filename));
        });
    } catch (error) {
        console.error('Erro ao processar download:', error);
    }
}); 