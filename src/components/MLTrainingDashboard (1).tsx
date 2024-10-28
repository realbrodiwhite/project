import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mlApi } from '../utils/mlApi';

const MLTrainingDashboard: React.FC = () => {
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [modelConfig, setModelConfig] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    optimizer: 'adam'
  });

  useEffect(() => {
    const unsubscribe = mlApi.onTrainingProgress((data) => {
      setMetrics(current => [...current, data]);
      addLog('info', `Epoch ${data.epoch}: Loss = ${data.loss.toFixed(4)}, Accuracy = ${data.accuracy.toFixed(4)}`);
    });

    mlApi.onTrainingComplete(() => {
      setTrainingStatus('complete');
      addLog('success', 'Training completed successfully!');
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const addLog = (type, message) => {
    setLogs(current => [...current, { type, message, timestamp: new Date().toISOString() }]);
  };

  const handleUpload = async () => {
    try {
      const result = await mlApi.uploadData('/path/to/data');
      if (result.success) {
        addLog('success', 'Data uploaded successfully');
      } else {
        setError('Failed to upload data');
      }
    } catch (err) {
      setError('Error uploading data');
    }
  };

  const handleStartTraining = async () => {
    try {
      const result = await mlApi.startTraining(modelConfig);
      if (result.success) {
        setTrainingStatus('training');
        addLog('info', 'Training started');
      } else {
        setError('Failed to start training');
      }
    } catch (err) {
      setError('Error starting training');
    }
  };

  return (
    <div>
      <h2>ML Training Dashboard</h2>
      <button onClick={handleUpload}>Upload Data</button>
      <button onClick={handleStartTraining} disabled={trainingStatus === 'training'}>
        {trainingStatus === 'idle' ? 'Start Training' : 'Training...'}
      </button>
      <p>Status: {trainingStatus}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {metrics.length > 0 && (
        <LineChart width={600} height={300} data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="loss" stroke="#8884d8" />
          <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" />
        </LineChart>
      )}
      <div>
        <h3>Logs</h3>
        {logs.map((log, index) => (
          <p key={index}>{log.timestamp}: {log.message}</p>
        ))}
      </div>
    </div>
  );
};

export default MLTrainingDashboard;
