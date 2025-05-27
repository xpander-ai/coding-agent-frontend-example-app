import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Navbar from './components/Navbar';

/**
 * Root application component configuring global layout, navigation, and routes.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global navigation bar */}
      <Navbar />
      {/* Main content area with routed pages */}
      <div className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
        </Routes>
      </div>
    </div>
  );
}
