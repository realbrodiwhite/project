// File: main.ts
// Summary: Main process file for Electron app, handling window creation and IPC communication

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // In development, load from React dev server
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Handlers
ipcMain.handle('upload-data', async (event, filePath: string) => {
    try {
        // TODO: Implement file upload logic here
        return { success: true, message: 'Data uploaded successfully' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
});

ipcMain.handle('start-training', async (event, params: any) => {
    try {
        // TODO: Implement training logic here
        return { success: true, message: 'Training started successfully' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
});

ipcMain.handle('export-metrics', async (event, data: any) => {
    try {
        // TODO: Implement metrics export logic here
        return { success: true, message: 'Metrics exported successfully' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
});

ipcMain.handle('export-logs', async (event, data: any) => {
    try {
        // TODO: Implement logs export logic here
        return { success: true, message: 'Logs exported successfully' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
});
