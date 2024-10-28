// File: src/index.tsx
// Summary: Entry point for the React application

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create a root for the React app
const root = ReactDOM.createRoot(rootElement);

// Render the App component within StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
