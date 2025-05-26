import { Link } from 'react-router-dom';
import type { Task } from '../types';

interface Props {
  task: Task;
}

export default function TaskListItem({ task }: Props) {
  return (
    <div className="p-4 border rounded flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.status}</p>
      </div>
      <Link to={`/task/${task.id}`} className="text-blue-500 hover:underline">
        View
      </Link>
    </div>
  );
}
