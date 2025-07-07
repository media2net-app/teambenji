import { useState, useRef, useEffect } from 'react';

const DUMMY_COACH = {
  id: 'coach1',
  name: 'Sarah Wilson',
  role: 'coach',
  avatar: 'SW',
  isOnline: true
};

const DUMMY_USER = {
  id: 'user1',
  name: 'Jij',
  role: 'user',
  avatar: 'U',
  isOnline: true
};

const DUMMY_MESSAGES = [
  {
    id: 'msg1',
    sender: DUMMY_COACH,
    content: 'Hoi! Hoe gaat het met je trainingsschema?',
    timestamp: '2024-01-20T09:00:00Z',
    type: 'text'
  },
  {
    id: 'msg2',
    sender: DUMMY_USER,
    content: 'Heel goed! Ik heb gisteren mijn squat PR verbeterd naar 100kg 💪',
    timestamp: '2024-01-20T09:15:00Z',
    type: 'text'
  },
  {
    id: 'msg3',
    sender: DUMMY_COACH,
    content: 'Wauw, dat is fantastisch! 🎉 Ik ben zo trots op je vooruitgang. Hoe voelde het?',
    timestamp: '2024-01-20T09:20:00Z',
    type: 'text'
  }
];

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [open, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      sender: DUMMY_USER,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setWaiting(true);
    // Simuleer coach response
    setTimeout(() => {
      const responses = [
        'Dat klinkt geweldig! 💪',
        'Goed bezig! Blijf zo doorgaan!',
        'Dank je voor de update! 👍',
        'Ik ben trots op je vooruitgang!',
        'Hoe voel je je na die training?'
      ];
      const response = {
        id: `msg-${Date.now()}-coach`,
        sender: DUMMY_COACH,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
      setWaiting(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) {
      return 'Nu';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 bg-[#E33412] hover:bg-[#b9260e] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all animate-bounce"
          aria-label="Open chat"
        >
          💬
        </button>
      )}
      {/* Chat Window */}
      {open && (
        <div className="fixed z-50 bottom-6 right-6 w-80 max-w-[95vw] bg-[#1F1F1F] rounded-2xl shadow-2xl border border-[#E33412] flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#3A3D4A] bg-[#1A1D29] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E33412] rounded-full flex items-center justify-center text-lg font-bold text-white">SW</div>
              <div>
                <div className="text-white font-semibold text-sm">Sarah Wilson</div>
                <div className="text-green-400 text-xs">Online</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white text-xl p-1 rounded transition-colors"
              aria-label="Sluit chat"
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#1F1F1F]" style={{ minHeight: 240, maxHeight: 320 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.id === DUMMY_USER.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-xs ${msg.sender.id === DUMMY_USER.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-7 h-7 bg-[#E33412] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {msg.sender.avatar}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.sender.id === DUMMY_USER.id ? 'bg-[#E33412] text-white' : 'bg-[#2A2D3A] text-white'}`}> 
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender.id === DUMMY_USER.id ? 'text-red-200' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
            {waiting && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-xs">
                  <div className="w-7 h-7 bg-[#E33412] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">SW</div>
                  <div className="p-3 rounded-lg bg-[#2A2D3A] text-white flex items-center gap-2">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-3 border-t border-[#3A3D4A] bg-[#1A1D29] rounded-b-2xl">
            <div className="flex items-center gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Typ een bericht..."
                className="flex-1 bg-[#2A2D3A] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E33412] resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || waiting}
                className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.25s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
} 