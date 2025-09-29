import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScenarioBuilder from './pages/ScenarioBuilder';
import Variables from './pages/Variables';
import Projections from './pages/Projections';
import Comparisons from './pages/Comparisons';
import Settings from './pages/Settings';
import { WorkspaceProvider } from './contexts/WorkspaceContext';

function App() {
  return (
    <WorkspaceProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioBuilder />} />
              <Route path="/variables" element={<Variables />} />
              <Route path="/projections" element={<Projections />} />
              <Route path="/comparisons" element={<Comparisons />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </div>
      </Router>
    </WorkspaceProvider>
  );
}

export default App;
