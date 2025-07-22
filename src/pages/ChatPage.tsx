import { useState, useRef, useEffect } from 'react';
import DataCard from '../components/DataCard';
import { chatService, type Chat, type Message, type ChatNotification } from '../services/chatService';
import DemoLock from '../components/DemoLock';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data from service
  useEffect(() => {
    const loadedChats = chatService.getChats();
    const loadedNotifications = chatService.getNotifications();
    
    setChats(loadedChats);
    setNotifications(loadedNotifications);
    
    // Set first chat as active
    if (loadedChats.length > 0) {
      setActiveChat(loadedChats[0].id);
    }
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      const loadedMessages = chatService.getMessages(activeChat);
      setMessages(loadedMessages);
      
      // Mark messages as read when opening chat
      chatService.markMessagesAsRead(activeChat);
      
      // Update local chat state to reflect read messages
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat 
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    }
  }, [activeChat]);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    // Send message using service
    const sentMessage = chatService.sendMessage(activeChat, newMessage);
    
    // Update local messages state
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
    
    // Refresh notifications to show any new ones from coach responses
    setTimeout(() => {
      const updatedNotifications = chatService.getNotifications();
      setNotifications(updatedNotifications);
      
      // Refresh messages to show coach response
      const updatedMessages = chatService.getMessages(activeChat);
      setMessages(updatedMessages);
    }, 2500); // Wait a bit longer than the coach response delay
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

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const markNotificationAsRead = (id: string) => {
    chatService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const activeChats = chats.filter(chat => chat.isActive);
  const activeChatData = chats.find(chat => chat.id === activeChat);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Chat</h1>
          <p className="text-gray-400">Communiceer met je coach en community</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-[#2A2D3A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors font-medium flex items-center gap-2"
          >
            <span>🔔</span>
            Notificaties
            {getUnreadCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E33412] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </button>
          <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2">
            <span>➕</span>
            Nieuwe Chat
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <DataCard title="Notificaties" value="" icon="🔔">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Geen notificaties</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                    notification.isRead 
                      ? 'bg-[#2A2D3A] border-gray-500' 
                      : 'bg-[#1A1D29] border-[#E33412]'
                  } ${
                    notification.priority === 'high' ? 'border-red-500' :
                    notification.priority === 'medium' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                  onClick={() => {
                    markNotificationAsRead(notification.id);
                    if (notification.chatId) {
                      setActiveChat(notification.chatId);
                      setShowNotifications(false);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {notification.type === 'message' ? '💬' : 
                           notification.type === 'system' ? '⚙️' : '⏰'}
                        </span>
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#E33412] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatTime(notification.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DataCard>
      )}

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <DataCard title="Chats" value="" icon="💬">
            <div className="space-y-2">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeChat === chat.id 
                      ? 'bg-[#E33412] bg-opacity-20 border border-[#E33412]' 
                      : 'bg-[#2A2D3A] hover:bg-[#3A3D4A]'
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {chat.type === 'individual' ? (
                          <div className="w-10 h-10 bg-[#E33412] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {chat.participants.find(p => p.role === 'coach')?.avatar || 'C'}
                            </span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#3A3D4A] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">👥</span>
                          </div>
                        )}
                        {chat.type === 'individual' && chat.participants.find(p => p.role === 'coach')?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1F1F1F]"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{chat.name}</h4>
                        {chat.lastMessage && (
                          <p className="text-gray-400 text-xs truncate">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {chat.lastMessage && (
                        <p className="text-gray-400 text-xs">
                          {formatTime(chat.lastMessage.timestamp)}
                        </p>
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="inline-block bg-[#E33412] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          {activeChatData ? (
            <DataCard title={activeChatData.name} value="" icon="💬">
              <div className="flex flex-col h-96">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 border-b border-[#3A3D4A]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {activeChatData.type === 'individual' ? (
                        <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {activeChatData.participants.find(p => p.role === 'coach')?.avatar || 'C'}
                          </span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-[#3A3D4A] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">👥</span>
                        </div>
                      )}
                      {activeChatData.type === 'individual' && activeChatData.participants.find(p => p.role === 'coach')?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-[#1F1F1F]"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{activeChatData.name}</h4>
                      {activeChatData.type === 'individual' && (
                        <p className="text-gray-400 text-xs">
                          {activeChatData.participants.find(p => p.role === 'coach')?.isOnline ? 'Online' : 'Offline'}
                        </p>
                      )}
                      {activeChatData.type === 'group' && (
                        <p className="text-gray-400 text-xs">
                          {activeChatData.participants.length} deelnemers
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <span>📞</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <span>🎥</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <span>ℹ️</span>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === 'user1' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-xs ${message.sender.id === 'user1' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-6 h-6 bg-[#E33412] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{message.sender.avatar}</span>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.sender.id === 'user1' 
                            ? 'bg-[#E33412] text-white' 
                            : 'bg-[#2A2D3A] text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender.id === 'user1' 
                              ? 'text-red-200' 
                              : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t border-[#3A3D4A]">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <span>📎</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <span>😊</span>
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type een bericht..."
                      className="flex-1 bg-[#2A2D3A] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E33412] resize-none"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>📤</span>
                    </button>
                  </div>
                </div>
              </div>
            </DataCard>
          ) : (
            <DataCard title="Selecteer een chat" value="" icon="💬">
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <p className="text-gray-400">Selecteer een chat om te beginnen met berichten</p>
              </div>
            </DataCard>
          )}
        </div>
      </div>
      <DemoLock />
    </div>
  );
} 