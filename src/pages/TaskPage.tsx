import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { LogsModal } from '../components/LogsModal';

export const TaskPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, isError } = useTaskDetail(taskId || '');
  const [showLogs, setShowLogs] = useState(false);
  const [message, setMessage] = useState('');

  if (isLoading) return <div className="p-4">Loading task...</div>;
  if (isError || !task) return <div className="p-4 text-red-500">Error loading task.</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{task.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Status: {task.status}</p>
      <div className="space-y-2">
        <h2 className="font-semibold">Timeline</h2>
        <ul className="list-disc list-inside">
          {task.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
      {task.status !== 'running' && (
        <form onSubmit={e => e.preventDefault()} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Add a comment"
            className="flex-1 p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}
      <button
        onClick={() => setShowLogs(true)}
        className="px-4 py-2 bg-gray-600 text-white rounded"
      >
        View Logs
      </button>
      {showLogs && <LogsModal onClose={() => setShowLogs(false)} taskId={task.id} />}
    </div>
  );
};