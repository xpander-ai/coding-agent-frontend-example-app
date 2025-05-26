import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useCreateTask } from '../hooks/useCreateTask';

export const Dashboard: React.FC = () => {
  const { data: tasks, isLoading, isError } = useTasks();
  const createTaskMutation = useCreateTask();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTaskMutation.mutate(title);
      setTitle('');
    }
  };

  if (isLoading) return <div className="p-4">Loading tasks...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading tasks.</div>;

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={createTaskMutation.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {createTaskMutation.isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      <ul className="space-y-2">
        {tasks?.map(task => (
          <li
            key={task.id}
            className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {task.status}
              </p>
            </div>
            <Link
              to={`/task/${task.id}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};