import { Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";

/**
 * Navigation bar showing app title and active executing task count.
 */
export default function Navbar() {
  const { data } = useTasks();
  // Count how many tasks are currently executing to display a spinner badge
  const executing = data?.filter((t) => t.status === "executing").length || 0;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between">
      <Link to="/" className="font-bold">
        Agentic Tasks Console
      </Link>
      <div className="flex items-center space-x-2">
        {executing > 0 && (
          <div className="flex items-center space-x-1">
            {/* Spinner icon indicating active task processing */}
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              ></path>
            </svg>
            <span>{executing}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
