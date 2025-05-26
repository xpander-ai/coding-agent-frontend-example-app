import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useTask } from '../hooks/useTask';
import Modal from '../components/Modal';
import { useLogs } from '../hooks/useLogs';
import { preserveScroll } from '../utils/scroll';

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading } = useTask(taskId!);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { data: logs } = useLogs(taskId!);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // send message - not implemented
    setMessage('');
  };

  if (isLoading) return <p>Loading...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{task.title}</h2>
      <div className="space-y-2">
        {task.steps.map((s) => (
          <div key={s.id} className="p-2 border rounded">
            {s.text}
          </div>
        ))}
      </div>

      {task.status !== 'running' && (
        <form onSubmit={onSubmit} className="flex space-x-2">
          <input
            className="flex-1 border rounded p-2 bg-white dark:bg-gray-800"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      )}

      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        View Logs
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-bold mb-2">Logs</h3>
        <div
          id="log-container"
          className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-2 rounded h-64 overflow-y-auto"
          ref={(el) => {
            if (!el || logs === undefined) return;
            preserveScroll(el, () => {
              el.textContent = logs;
            });
          }}
        />
      </Modal>
    </div>
  );
}
