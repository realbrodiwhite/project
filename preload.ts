// File: preload.ts
// Summary: Preload script for Electron app, exposing IPC communication to the renderer process

import { contextBridge, ipcRenderer } from 'electron';

// Define the shape of the electron object
interface ElectronAPI {
    uploadData: (filePath: string) => Promise<any>;
    startTraining: (params: any) => Promise<any>;
    exportMetrics: (data: any) => Promise<any>;
    exportLogs: (data: any) => Promise<any>;
    onTrainingProgress: (callback: (data: TrainingProgress) => void) => () => void;
    onTrainingComplete: (callback: () => void) => void;
}

interface TrainingProgress {
    epoch: number;
    loss: number;
    accuracy: number;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    uploadData: (filePath: string) => ipcRenderer.invoke('upload-data', filePath),
    startTraining: (params: any) => ipcRenderer.invoke('start-training', params),
    exportMetrics: (data: any) => ipcRenderer.invoke('export-metrics', data),
    exportLogs: (data: any) => ipcRenderer.invoke('export-logs', data),
    onTrainingProgress: (callback: (data: TrainingProgress) => void) => {
        // Simulate training progress for demo
        const interval = setInterval(() => {
            callback({
                epoch: Math.floor(Math.random() * 100),
                loss: Math.random(),
                accuracy: 0.5 + (Math.random() * 0.5)
            });
        }, 2000);
        return () => clearInterval(interval);
    },
    onTrainingComplete: (callback: () => void) => {
        // Simulate training completion after 30 seconds
        setTimeout(callback, 30000);
    }
} as ElectronAPI);
