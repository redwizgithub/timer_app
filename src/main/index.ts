import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import path from 'node:path';
const isSquirrelStartup: boolean = require('electron-squirrel-startup');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (isSquirrelStartup) {
    app.quit();
}

const createWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow: BrowserWindow | null = new BrowserWindow({
        width: 300,
        height: 300,
        autoHideMenuBar: true,
        // frame: false,
        webPreferences: {
            preload: path.join(__dirname, '../../dist/renderer/preload.js'),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../../src/html/index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    // I DISABLED THIS

    return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let tray: Tray;
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
    mainWindow = createWindow();

    // creating a tray here
    const icon = nativeImage.createFromPath("C:\\Users\\andre\\Downloads\\8e4567c03a4ce5fd.png");
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Minimize', type: 'normal', click: function() {
                mainWindow.hide();
            }
        },
        { label: 'Quit', type: 'normal', role: 'quit' }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Desktop Timer');
    tray.setTitle('Timer App');
    tray.on('click', function() {
        mainWindow.show();
    });

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// TODO:
// opens the miniplayer
function openMiniplayer(): void {
    createMiniplayerWindow();
    hideMainWindow();
}

// creates the miniplayer window
function createMiniplayerWindow(): BrowserWindow {
    const miniplayer: BrowserWindow = new BrowserWindow({
        width: 300,
        height: 300,
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, '../renderer/preload.js'),
        },
    });

    miniplayer.loadFile(path.join(__dirname, '../html/miniplayer.html'));

    return miniplayer;
}

function hideMainWindow() {
    mainWindow.hide();
}
