"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hello Aditi! I am WealthWiz. Based on your readiness score of 62, I recommend sticking to SIPs. How can I help you today?' }
  ]);
  
  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Handle Sending Message
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 2. Simulate AI API Call (Replace this with real backend fetch later)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Response logic (For Demo purposes)
      let aiText = "That's a great question. Given the current market volatility in the IT sector, I would advise caution.";
      if (input.toLowerCase().includes("infy") || input.toLowerCase().includes("infosys")) {
        aiText = "Infosys is currently facing some sector headwinds. Since your portfolio is already 67% Tech, I wouldn't recommend adding more right now.";
      } else if (input.toLowerCase().includes("sip")) {
        aiText = "SIPs are the best way to average out cost. For your risk profile, a Nifty 50 Index fund SIP is ideal.";
      }

      const botMsg = { id: Date.now() + 1, role: 'bot', text: aiText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      
      {/* --- Chat Window (Only visible if isOpen is true) --- */}
      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-[#0F291E] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">WealthWiz AI</h3>
                <p className="text-[10px] text-green-400">● Online | Personalized Advisor</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-200 rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-green-600" />
                  <span className="text-xs text-gray-400">Analyzing portfolio...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your stocks..."
                className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* --- Floating Button --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-800' : 'bg-black'} text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 hover:scale-105 transition-transform`}
      >
        {isOpen ? (
          <>
            <X size={20} />
            <span className="font-bold text-sm">Close Chat</span>
          </>
        ) : (
          <>
            <div className="flex text-green-400">
              <MessageCircle size={20} fill="currentColor" className="text-green-900" />
              <span className="font-bold ml-1">_RK</span>
            </div>
            <span className="font-bold text-sm">Ask WealthWiz</span>
          </>
        )}
      </button>

    </div>
  );
}