interface TrainingProgress {
    epoch: number;
    loss: number;
    accuracy: number;
}

const API_URL = '/api/ml-training';

export const mlApi = {
    uploadData: async (filePath: string) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-data', filePath })
        });
        return response.json();
    },

    startTraining: async (params: any) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start-training', params })
        });
        return response.json();
    },

    exportMetrics: async (data: any) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'export-metrics', data })
        });
        return response.json();
    },

    exportLogs: async (data: any) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'export-logs', data })
        });
        return response.json();
    },

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
};
