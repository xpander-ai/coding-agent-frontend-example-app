import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

export const Navbar: React.FC = () => {
  const { data: tasks } = useTasks();
  const runningCount = tasks?.filter(t => t.status === 'running').length || 0;
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">
        Task Manager
      </Link>
      <div className="flex items-center">
        {runningCount > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{runningCount} running</span>
          </div>
        )}
      </div>
    </nav>
  );
};