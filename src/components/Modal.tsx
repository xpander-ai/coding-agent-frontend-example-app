import { ReactNode, useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", esc);
    }
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded w-[90vw] h-[90vh] max-w-none max-h-none overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white text-xl font-bold z-10"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Copy Button */}
        <button
          onClick={() => {
            const text = contentRef.current?.textContent ?? "";
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-10 text-xs bg-white dark:bg-gray-700 border px-2 py-1 rounded shadow z-10 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Copy
        </button>

        {/* Scrollable content area */}
        <div ref={contentRef} className="h-full overflow-auto p-4 pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
