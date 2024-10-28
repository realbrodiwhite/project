import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, FileText, AlertCircle, Check, RefreshCw, Database, 
         Settings, Play, Pause, ChevronRight, Upload, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Input } from './ui/input';

import { mlApi } from '../utils/mlApi';

const MLTrainingDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [modelConfig, setModelConfig] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    optimizer: 'adam'
  });

  const steps = [
    { id: 'upload', title: 'Upload Data', icon: <Upload className="w-4 h-4" /> },
    { id: 'configure', title: 'Configure Model', icon: <Settings className="w-4 h-4" /> },
    { id: 'train', title: 'Train Model', icon: <Play className="w-4 h-4" /> },
    { id: 'evaluate', title: 'Evaluate Results', icon: <Book className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const unsubscribe = mlApi.onTrainingProgress((data) => {
      setMetrics(current => [...current, data]);
      addLog('info', `Epoch ${data.epoch}: Loss = ${data.loss.toFixed(4)}, Accuracy = ${data.accuracy.toFixed(4)}`);
    });

    mlApi.onTrainingComplete(() => {
      setTrainingStatus('complete');
      addLog('success', 'Training completed successfully');
      setActiveStep(3);
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
        setActiveStep(1);
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
        setActiveStep(2);
      } else {
        setError('Failed to start training');
      }
    } catch (err) {
      setError('Error starting training');
    }
  };

  const handleExportMetrics = async () => {
    try {
      await mlApi.exportMetrics(metrics);
      addLog('success', 'Metrics exported successfully');
    } catch (err) {
      setError('Error exporting metrics');
    }
  };

  const handleExportLogs = async () => {
    try {
      await mlApi.exportLogs(logs);
      addLog('success', 'Logs exported successfully');
    } catch (err) {
      setError('Error exporting logs');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await mlApi.processChat(chatInput);
      const assistantMessage = { role: 'assistant', content: response };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Error processing chat message');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-64 p-4 ${sidebarOpen ? '' : 'hidden'}`}>
        <h2 className="text-xl font-bold mb-4">ML Training Steps</h2>
        <ul>
          {steps.map((step, index) => (
            <li key={step.id} className={`mb-2 ${index === activeStep ? 'text-blue-600' : ''}`}>
              <button 
                className="flex items-center"
                onClick={() => setActiveStep(index)}
              >
                {step.icon}
                <span className="ml-2">{step.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <button 
          className="mb-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold mb-8">ML Training Dashboard</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            {/* Dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Learning Rate</label>
                      <Input 
                        type="number" 
                        value={modelConfig.learningRate} 
                        onChange={(e) => setModelConfig({...modelConfig, learningRate: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Batch Size</label>
                      <Input 
                        type="number" 
                        value={modelConfig.batchSize} 
                        onChange={(e) => setModelConfig({...modelConfig, batchSize: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Epochs</label>
                      <Input 
                        type="number" 
                        value={modelConfig.epochs} 
                        onChange={(e) => setModelConfig({...modelConfig, epochs: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Optimizer</label>
                      <Select 
                        value={modelConfig.optimizer} 
                        onValueChange={(value) => setModelConfig({...modelConfig, optimizer: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select optimizer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adam">Adam</SelectItem>
                          <SelectItem value="sgd">SGD</SelectItem>
                          <SelectItem value="rmsprop">RMSprop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleStartTraining}>Start Training</Button>
                </CardFooter>
              </Card>

              {/* Training Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={trainingStatus === 'complete' ? 100 : (metrics.length / modelConfig.epochs) * 100} />
                  <p className="mt-2">Status: {trainingStatus}</p>
                </CardContent>
              </Card>

              {/* Metrics Chart */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Training Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart width={600} height={300} data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="loss" stroke="#8884d8" />
                    <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" />
                  </LineChart>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleExportMetrics}>Export Metrics</Button>
                </CardFooter>
              </Card>

              {/* Logs */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {logs.map((log, index) => (
                      <div key={index} className={`mb-2 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : ''}`}>
                        {log.timestamp}: {log.message}
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleExportLogs}>Export Logs</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="chat">
            {/* AI Assistant Chat */}
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] mb-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                      <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.content}
                    </div>
                  ))}
                </ScrollArea>
                <form onSubmit={handleChatSubmit} className="flex">
                  <Input 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Ask a question..."
                    className="flex-grow mr-2"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MLTrainingDashboard;
