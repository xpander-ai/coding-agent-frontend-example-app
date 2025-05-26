import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { TaskPage } from './pages/TaskPage';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/task/:taskId" element={<TaskPage />} />
        </Routes>
      </div>
    </Router>
  </QueryClientProvider>
);

export default App;
