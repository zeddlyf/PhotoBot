import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { MessageSquare, Send } from 'lucide-react';

interface LiveChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserId?: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  messages,
  onSendMessage,
  currentUserId
}) => {
  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-72 rounded-2xl glass-panel p-4 border border-zinc-800">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        <MessageSquare className="h-4 w-4 text-rose-400" />
        <span>Room Chat</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {messages.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-8">No messages yet. Say hello!</p>
        ) : (
          messages.map((msg) => {
            const isSys = msg.userId === 'system';
            const isMe = msg.userId === currentUserId;

            if (isSys) {
              return (
                <div key={msg.id} className="text-center my-1.5">
                  <span className="text-[10px] font-medium text-rose-300/80 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-0.5">
                  <span className="font-semibold text-zinc-300">{msg.username}</span>
                  <span>• {msg.timestamp}</span>
                </div>
                <div
                  className={`rounded-xl px-3 py-2 text-xs ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-tr-none'
                      : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none border border-zinc-800 focus:border-rose-500 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex items-center justify-center rounded-xl bg-rose-600 p-2 text-white hover:bg-rose-500 disabled:opacity-40 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
