// File: src/App.tsx
// Summary: Main App component that renders the MLTrainingDashboard

import React from 'react';
import MLTrainingDashboard from './components/MLTrainingDashboard';

// App component: The root component of the application
function App() {
    return (
        <div className="app">
            {/* Render the MLTrainingDashboard component */}
            <MLTrainingDashboard />
        </div>
    );
}

export default App;
