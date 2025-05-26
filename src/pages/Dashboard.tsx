import { FormEvent, useState } from 'react';
import { useTasks, useCreateTask } from '../hooks/useTasks';
import TaskListItem from '../components/TaskListItem';

export default function Dashboard() {
  const { data, isLoading } = useTasks();
  const createTask = useCreateTask();
  const [title, setTitle] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createTask.mutate({title});
    setTitle('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <input
          className="flex-1 border rounded p-2 bg-white dark:bg-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {data?.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
