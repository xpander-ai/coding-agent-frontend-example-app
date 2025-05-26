import React, { useEffect, useRef } from 'react';
import { useTaskLogs } from '../hooks/useTaskLogs';

interface LogsModalProps {
  taskId: string;
  onClose: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({ taskId, onClose }) => {
  const { data: logs, isLoading, isError } = useTaskLogs(taskId);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  const handleScroll = () => {
    if (containerRef.current) {
      scrollRef.current = containerRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollRef.current;
    }
  }, [logs]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded p-4 max-w-lg w-full max-h-full overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Logs</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        {isLoading && <div>Loading logs...</div>}
        {isError && <div className="text-red-500">Error loading logs.</div>}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="space-y-1 overflow-y-auto max-h-64 p-2 bg-gray-100 dark:bg-gray-700 rounded"
        >
          {logs?.map((line, idx) => (
            <p
              key={idx}
              className="text-sm font-mono text-gray-800 dark:text-gray-200"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};