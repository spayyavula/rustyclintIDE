import React, { useRef, useState, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
};

const initialMessages: Message[] = [
  { id: 1, text: "Welcome to RustyClint chat!", sender: "other", timestamp: "09:00" },
  { id: 2, text: "How can I help you today?", sender: "other", timestamp: "09:01" },
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: input,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-[#23272e]">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#222] text-sm font-semibold text-[#bfbfbf] flex items-center">
        <span>Team Chat</span>
        <span className="ml-auto text-xs text-[#888]">{messages.length} messages</span>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg shadow text-sm ${
                msg.sender === 'me'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-[#1e1e1e] text-gray-200 rounded-bl-none'
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] text-right text-gray-400 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-2 border-t border-[#222] bg-[#23272e] flex items-center">
        <input
          className="flex-1 bg-[#18181a] text-gray-200 px-3 py-2 rounded focus:outline-none"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;