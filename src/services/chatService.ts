export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'user' | 'coach' | 'admin';
    avatar: string;
  };
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  chatId: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: {
    id: string;
    name: string;
    role: 'user' | 'coach' | 'admin';
    avatar: string;
    isOnline: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatNotification {
  id: string;
  type: 'message' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  chatId?: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
}

export interface ChatStats {
  totalChats: number;
  activeChats: number;
  unreadMessages: number;
  totalMessages: number;
  averageResponseTime: number;
  lastActivity: string;
}

class ChatService {
  private readonly CHATS_STORAGE_KEY = 'teambenji_chats';
  private readonly MESSAGES_STORAGE_KEY = 'teambenji_messages';
  private readonly NOTIFICATIONS_STORAGE_KEY = 'teambenji_chat_notifications';
  private readonly CURRENT_USER_ID = 'user1'; // Mock current user

  // Get all chats for current user
  getChats(): Chat[] {
    try {
      const data = localStorage.getItem(this.CHATS_STORAGE_KEY);
      let chats = data ? JSON.parse(data) : [];
      if (!chats || chats.length === 0) {
        chats = this.getDefaultChats();
        localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(chats));
      }
      // Filter chats waar current user participant is
      return chats.filter((chat: Chat) => 
        chat.participants.some(p => p.id === this.CURRENT_USER_ID)
      );
    } catch (error) {
      console.error('Error loading chats:', error);
      return this.getDefaultChats();
    }
  }

  // Get messages for a specific chat
  getMessages(chatId: string): Message[] {
    try {
      const data = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
      const allMessages = data ? JSON.parse(data) : this.getDefaultMessages();
      
      return allMessages.filter((message: Message) => message.chatId === chatId)
        .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Send a new message
  sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Message {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: {
        id: this.CURRENT_USER_ID,
        name: 'Jij',
        role: 'user',
        avatar: 'U'
      },
      content,
      timestamp: new Date().toISOString(),
      type,
      isRead: true,
      chatId
    };

    // Save message
    this.saveMessage(message);
    
    // Update chat's last message and timestamp
    this.updateChatLastMessage(chatId, message);
    
    // Simulate coach response for individual chats
    if (type === 'text') {
      this.simulateCoachResponse(chatId);
    }

    return message;
  }

  // Mark messages as read
  markMessagesAsRead(chatId: string): void {
    try {
      const data = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
      const allMessages = data ? JSON.parse(data) : [];
      
      const updatedMessages = allMessages.map((message: Message) => {
        if (message.chatId === chatId && message.sender.id !== this.CURRENT_USER_ID) {
          return { ...message, isRead: true };
        }
        return message;
      });
      
      localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
      
      // Update chat unread count
      this.updateChatUnreadCount(chatId, 0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Get chat notifications
  getNotifications(): ChatNotification[] {
    try {
      const data = localStorage.getItem(this.NOTIFICATIONS_STORAGE_KEY);
      const notifications = data ? JSON.parse(data) : this.getDefaultNotifications();
      
      return notifications.filter((notif: ChatNotification) => notif.userId === this.CURRENT_USER_ID)
        .sort((a: ChatNotification, b: ChatNotification) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    try {
      const data = localStorage.getItem(this.NOTIFICATIONS_STORAGE_KEY);
      const notifications = data ? JSON.parse(data) : [];
      
      const updatedNotifications = notifications.map((notif: ChatNotification) => {
        if (notif.id === notificationId) {
          return { ...notif, isRead: true };
        }
        return notif;
      });
      
      localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Get chat statistics
  getChatStats(): ChatStats {
    const chats = this.getChats();
    const allMessages = this.getAllMessages();
    const notifications = this.getNotifications();

    return {
      totalChats: chats.length,
      activeChats: chats.filter(c => c.isActive).length,
      unreadMessages: chats.reduce((sum, chat) => sum + chat.unreadCount, 0),
      totalMessages: allMessages.filter(m => m.sender.id === this.CURRENT_USER_ID).length,
      averageResponseTime: this.calculateAverageResponseTime(),
      lastActivity: this.getLastActivity()
    };
  }

  // Create a new chat
  createChat(name: string, type: 'individual' | 'group', participantIds: string[]): Chat {
    const chat: Chat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      participants: this.getParticipantDetails(participantIds),
      unreadCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveChat(chat);
    return chat;
  }

  // Private helper methods
  private saveMessage(message: Message): void {
    try {
      const data = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
      const messages = data ? JSON.parse(data) : [];
      messages.push(message);
      localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  private saveChat(chat: Chat): void {
    try {
      const data = localStorage.getItem(this.CHATS_STORAGE_KEY);
      const chats = data ? JSON.parse(data) : [];
      const existingIndex = chats.findIndex((c: Chat) => c.id === chat.id);
      
      if (existingIndex >= 0) {
        chats[existingIndex] = chat;
      } else {
        chats.push(chat);
      }
      
      localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }

  private updateChatLastMessage(chatId: string, message: Message): void {
    try {
      const data = localStorage.getItem(this.CHATS_STORAGE_KEY);
      const chats = data ? JSON.parse(data) : [];
      
      const updatedChats = chats.map((chat: Chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: message,
            updatedAt: new Date().toISOString()
          };
        }
        return chat;
      });
      
      localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error updating chat last message:', error);
    }
  }

  private updateChatUnreadCount(chatId: string, count: number): void {
    try {
      const data = localStorage.getItem(this.CHATS_STORAGE_KEY);
      const chats = data ? JSON.parse(data) : [];
      
      const updatedChats = chats.map((chat: Chat) => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: count };
        }
        return chat;
      });
      
      localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error updating chat unread count:', error);
    }
  }

  private simulateCoachResponse(chatId: string): void {
    // Get chat to find coach
    const chats = this.getChats();
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat || chat.type !== 'individual') return;
    
    const coach = chat.participants.find(p => p.role === 'coach');
    if (!coach) return;

    // Simulate response after 1-3 seconds
    setTimeout(() => {
      const responses = [
        'Dat klinkt geweldig! 💪',
        'Goed bezig! Blijf zo doorgaan!',
        'Dank je voor de update! 👍',
        'Ik ben trots op je vooruitgang!',
        'Hoe voel je je na die training?',
        'Mooi werk! Laten we dit vasthouden.',
        'Geweldig! Je bent echt op de goede weg.',
        'Dat is precies wat ik wilde horen! 🎉',
        'Fantastisch! Hoe kunnen we dit verder uitbouwen?',
        'Je doet het super! Blijf gemotiveerd.'
      ];

      const response: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: {
          id: coach.id,
          name: coach.name,
          role: 'coach',
          avatar: coach.avatar
        },
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false,
        chatId
      };

      this.saveMessage(response);
      this.updateChatLastMessage(chatId, response);
      this.incrementChatUnreadCount(chatId);
      
      // Create notification
      this.createNotification({
        type: 'message',
        title: `Nieuw bericht van ${coach.name}`,
        message: response.content,
        chatId,
        priority: 'medium'
      });
    }, Math.random() * 2000 + 1000); // 1-3 seconds
  }

  private incrementChatUnreadCount(chatId: string): void {
    try {
      const data = localStorage.getItem(this.CHATS_STORAGE_KEY);
      const chats = data ? JSON.parse(data) : [];
      
      const updatedChats = chats.map((chat: Chat) => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: chat.unreadCount + 1 };
        }
        return chat;
      });
      
      localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error incrementing chat unread count:', error);
    }
  }

  private createNotification(params: {
    type: 'message' | 'system' | 'reminder';
    title: string;
    message: string;
    chatId?: string;
    priority: 'low' | 'medium' | 'high';
  }): void {
    const notification: ChatNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      title: params.title,
      message: params.message,
      timestamp: new Date().toISOString(),
      isRead: false,
      chatId: params.chatId,
      priority: params.priority,
      userId: this.CURRENT_USER_ID
    };

    try {
      const data = localStorage.getItem(this.NOTIFICATIONS_STORAGE_KEY);
      const notifications = data ? JSON.parse(data) : [];
      notifications.push(notification);
      localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  private getAllMessages(): Message[] {
    try {
      const data = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading all messages:', error);
      return [];
    }
  }

  private calculateAverageResponseTime(): number {
    // Mock calculation - in real app would calculate based on actual response times
    return Math.floor(Math.random() * 30) + 5; // 5-35 minutes
  }

  private getLastActivity(): string {
    const messages = this.getAllMessages();
    if (messages.length === 0) return new Date().toISOString();
    
    const lastMessage = messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
    return lastMessage.timestamp;
  }

  private getParticipantDetails(participantIds: string[]): Chat['participants'] {
    // Mock participant details - in real app would fetch from user service
    const mockUsers = [
      { id: 'user1', name: 'Jij', role: 'user' as const, avatar: 'U', isOnline: true },
      { id: 'coach1', name: 'Sarah Wilson', role: 'coach' as const, avatar: 'SW', isOnline: true },
      { id: 'coach2', name: 'Mark Johnson', role: 'coach' as const, avatar: 'MJ', isOnline: false },
      { id: 'user2', name: 'Lisa de Vries', role: 'user' as const, avatar: 'LV', isOnline: true },
      { id: 'user3', name: 'Tom van der Berg', role: 'user' as const, avatar: 'TB', isOnline: false }
    ];

    return participantIds.map(id => {
      const user = mockUsers.find(u => u.id === id);
      return user || { id, name: 'Unknown', role: 'user' as const, avatar: '?', isOnline: false };
    });
  }

  // Default data for initial setup
  private getDefaultChats(): Chat[] {
    return [
      {
        id: '1',
        name: 'Sarah Wilson (Coach)',
        type: 'individual',
        participants: [
          { id: 'user1', name: 'Jij', role: 'user', avatar: 'U', isOnline: true },
          { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW', isOnline: true }
        ],
        unreadCount: 2,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      },
      {
        id: '2',
        name: 'Mark Johnson (Coach)',
        type: 'individual',
        participants: [
          { id: 'user1', name: 'Jij', role: 'user', avatar: 'U', isOnline: true },
          { id: 'coach2', name: 'Mark Johnson', role: 'coach', avatar: 'MJ', isOnline: false }
        ],
        unreadCount: 0,
        isActive: true,
        createdAt: '2024-01-10T14:00:00Z',
        updatedAt: '2024-01-20T10:15:00Z'
      },
      {
        id: '3',
        name: 'Team Benji Community',
        type: 'group',
        participants: [
          { id: 'user1', name: 'Jij', role: 'user', avatar: 'U', isOnline: true },
          { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW', isOnline: true },
          { id: 'user2', name: 'Lisa de Vries', role: 'user', avatar: 'LV', isOnline: true },
          { id: 'user3', name: 'Tom van der Berg', role: 'user', avatar: 'TB', isOnline: false }
        ],
        unreadCount: 5,
        isActive: true,
        createdAt: '2024-01-05T09:00:00Z',
        updatedAt: '2024-01-20T14:45:00Z'
      }
    ];
  }

  private getDefaultMessages(): Message[] {
    return [
      // Chat 1 messages
      {
        id: 'msg1-1',
        sender: { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW' },
        content: 'Hoi! Hoe gaat het met je trainingsschema?',
        timestamp: '2024-01-20T09:00:00Z',
        type: 'text',
        isRead: true,
        chatId: '1'
      },
      {
        id: 'msg1-2',
        sender: { id: 'user1', name: 'Jij', role: 'user', avatar: 'U' },
        content: 'Heel goed! Ik heb gisteren mijn squat PR verbeterd naar 100kg 💪',
        timestamp: '2024-01-20T09:15:00Z',
        type: 'text',
        isRead: true,
        chatId: '1'
      },
      {
        id: 'msg1-3',
        sender: { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW' },
        content: 'Wauw, dat is fantastisch! 🎉 Ik ben zo trots op je vooruitgang. Hoe voelde het?',
        timestamp: '2024-01-20T09:20:00Z',
        type: 'text',
        isRead: true,
        chatId: '1'
      },
      {
        id: 'msg1-4',
        sender: { id: 'user1', name: 'Jij', role: 'user', avatar: 'U' },
        content: 'Zwaar maar goed! Mijn techniek voelde veel beter dan vorige week.',
        timestamp: '2024-01-20T09:25:00Z',
        type: 'text',
        isRead: true,
        chatId: '1'
      },
      {
        id: 'msg1-5',
        sender: { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW' },
        content: 'Hoe ging je training vandaag? Ik zag dat je je squat PR hebt verbeterd! 🏋️‍♀️',
        timestamp: '2024-01-20T15:30:00Z',
        type: 'text',
        isRead: false,
        chatId: '1'
      },
      // Chat 2 messages
      {
        id: 'msg2-1',
        sender: { id: 'coach2', name: 'Mark Johnson', role: 'coach', avatar: 'MJ' },
        content: 'Hoi! Klaar voor je cardio sessie van morgen?',
        timestamp: '2024-01-20T08:00:00Z',
        type: 'text',
        isRead: true,
        chatId: '2'
      },
      {
        id: 'msg2-2',
        sender: { id: 'user1', name: 'Jij', role: 'user', avatar: 'U' },
        content: 'Ja! Wat staat er op het programma?',
        timestamp: '2024-01-20T08:30:00Z',
        type: 'text',
        isRead: true,
        chatId: '2'
      },
      {
        id: 'msg2-3',
        sender: { id: 'coach2', name: 'Mark Johnson', role: 'coach', avatar: 'MJ' },
        content: 'Vergeet niet om je cardio sessie in te plannen voor morgen!',
        timestamp: '2024-01-20T10:15:00Z',
        type: 'text',
        isRead: true,
        chatId: '2'
      },
      // Chat 3 messages
      {
        id: 'msg3-1',
        sender: { id: 'coach1', name: 'Sarah Wilson', role: 'coach', avatar: 'SW' },
        content: 'Welkom in de Team Benji Community! 🎉',
        timestamp: '2024-01-20T12:00:00Z',
        type: 'text',
        isRead: true,
        chatId: '3'
      },
      {
        id: 'msg3-2',
        sender: { id: 'user2', name: 'Lisa de Vries', role: 'user', avatar: 'LV' },
        content: 'Hoi allemaal! Ik ben Lisa, fijn om hier te zijn!',
        timestamp: '2024-01-20T12:30:00Z',
        type: 'text',
        isRead: true,
        chatId: '3'
      },
      {
        id: 'msg3-3',
        sender: { id: 'user3', name: 'Tom van der Berg', role: 'user', avatar: 'TB' },
        content: 'Hey! Tom hier. Zin om samen te trainen!',
        timestamp: '2024-01-20T13:00:00Z',
        type: 'text',
        isRead: true,
        chatId: '3'
      },
      {
        id: 'msg3-4',
        sender: { id: 'user2', name: 'Lisa de Vries', role: 'user', avatar: 'LV' },
        content: 'Wie gaat er mee naar de groepstraining van morgen?',
        timestamp: '2024-01-20T14:45:00Z',
        type: 'text',
        isRead: false,
        chatId: '3'
      }
    ];
  }

  private getDefaultNotifications(): ChatNotification[] {
    return [
      {
        id: 'notif1',
        type: 'message',
        title: 'Nieuw bericht van Sarah Wilson',
        message: 'Hoe ging je training vandaag? Ik zag dat je...',
        timestamp: '2024-01-20T15:30:00Z',
        isRead: false,
        chatId: '1',
        priority: 'medium',
        userId: 'user1'
      },
      {
        id: 'notif2',
        type: 'system',
        title: 'Training herinnering',
        message: 'Je hebt over 1 uur een training gepland met Mark Johnson',
        timestamp: '2024-01-20T16:00:00Z',
        isRead: false,
        priority: 'high',
        userId: 'user1'
      },
      {
        id: 'notif3',
        type: 'message',
        title: 'Nieuwe berichten in Team Benji Community',
        message: '5 nieuwe berichten in de groepschat',
        timestamp: '2024-01-20T14:45:00Z',
        isRead: true,
        chatId: '3',
        priority: 'low',
        userId: 'user1'
      }
    ];
  }
}

export const chatService = new ChatService(); 