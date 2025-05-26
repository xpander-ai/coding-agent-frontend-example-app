import React from 'react';

interface ChatBubbleProps {
  message: string;
  avatarUrl?: string;
  timestamp?: string;
  isUser?: boolean;
}

export default function ChatBubble({
  message,
  avatarUrl,
  timestamp,
  isUser = false,
}: ChatBubbleProps) {
  return (
    <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && avatarUrl && (
        <img src={avatarUrl} alt="agent" className="w-8 h-8 rounded-full mr-2" />
      )}
      <div
        className={`rounded-lg p-2 max-w-xs ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message}
        {timestamp && (
          <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
        )}
      </div>
      {isUser && avatarUrl && (
        <img src={avatarUrl} alt="user" className="w-8 h-8 rounded-full ml-2" />
      )}
    </div>
  );
}