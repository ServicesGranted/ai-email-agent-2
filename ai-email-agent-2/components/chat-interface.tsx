
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import TimestampDisplay from './timestamp-display';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Email Assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate a mock response
      const responses = [
        "I understand your request. Let me help you with that.",
        "That's a great question! Here's what I can do for you.",
        "I've processed your request. Is there anything else you'd like me to help with?",
        "Thanks for your message. I'm here to assist you with your email management needs.",
        "I can help you organize your emails more efficiently. What would you like to do next?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const isRecentMessage = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    return diff < 5000; // 5 seconds
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-container fade-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Email Assistant</h1>
          </div>
          <p className="text-center text-gray-400 mt-2">
            Your intelligent email management companion
          </p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} slide-up`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {!message.isUser && (
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                
                <div
                  className={`message-bubble p-4 ${
                    message.isUser ? 'message-user' : 'message-bot'
                  } ${
                    isRecentMessage(message.timestamp) ? 'message-recent' : ''
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                    <TimestampDisplay timestamp={message.timestamp} />
                  </div>
                </div>

                {message.isUser && (
                  <div className="p-2 rounded-full bg-blue-500/20 backdrop-blur-sm flex-shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start slide-up">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="message-bubble message-bot p-4">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter command (e.g., 'create reminder to clean my room', 'move emails from Kevin to Friends')"
                className="w-full p-4 glass-input resize-none min-h-[60px] max-h-[120px]"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="glass-button px-6 py-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              <span className="text-green-400">✓ Ready to assist you</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
