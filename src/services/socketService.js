import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  // Connect to Socket.IO server with promise
  connectAsync(token) {
    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return Promise.resolve(this.socket);
    }

    console.log('Connecting to Socket.IO server...');

    return new Promise((resolve, reject) => {
      this.socket = io(API_BASE_URL, {
        auth: {
          token,
          userType: 'admin'
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket.IO connected:', this.socket.id);
        this.connected = true;
      });

      // Connection confirmation from server
      this.socket.on('connected', (data) => {
        console.log('✅ Server confirmed connection:', data);
        resolve(this.socket);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('⚠️ Socket.IO disconnected:', reason);
        this.connected = false;
        // Auto-reconnect will be handled by socket.io client
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('✅ Socket.IO reconnected after', attemptNumber, 'attempts');
        this.connected = true;
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('🔄 Socket.IO reconnection attempt:', attemptNumber);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error.message);
        if (!this.connected) {
          reject(error);
        }
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket.IO error:', error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Socket connection timeout'));
        }
      }, 10000);
    });
  }

  // Sync connect method for backward compatibility
  connect(token) {
    if (this.socket && this.connected) {
      return this.socket;
    }
    
    this.connectAsync(token).catch(err => {
      console.error('Socket connection failed:', err);
    });
    
    return this.socket;
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
      console.log('Socket.IO disconnected');
    }
  }

  // Join a specific chat room
  joinChat(chatId) {
    if (this.socket && this.connected) {
      this.socket.emit('joinChat', chatId);
      console.log(`Joined chat room: ${chatId}`);
    }
  }

  // Leave a chat room
  leaveChat(chatId) {
    if (this.socket && this.connected) {
      this.socket.emit('leaveChat', chatId);
      console.log(`Left chat room: ${chatId}`);
    }
  }

  // Join a branch room (to receive all branch chat updates)
  joinBranch(branchId) {
    if (this.socket && this.connected) {
      this.socket.emit('joinBranch', branchId);
      console.log(`Joined branch room: ${branchId}`);
    }
  }

  // Leave a branch room
  leaveBranch(branchId) {
    if (this.socket && this.connected) {
      this.socket.emit('leaveBranch', branchId);
      console.log(`Left branch room: ${branchId}`);
    }
  }

  // Send a message via socket
  sendMessage(data) {
    if (this.socket && this.connected) {
      this.socket.emit('sendMessage', data);
    } else {
      console.error('Socket not connected');
    }
  }

  // Send typing indicator
  startTyping(chatId) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', { chatId });
    }
  }

  stopTyping(chatId) {
    if (this.socket && this.connected) {
      this.socket.emit('stopTyping', { chatId });
    }
  }

  // Mark messages as read
  markAsRead(chatId) {
    if (this.socket && this.connected) {
      this.socket.emit('markAsRead', { chatId });
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
      this.listeners.set('newMessage', callback);
    }
  }

  // Listen for chat updates (new chats, unread count changes)
  onChatUpdate(callback) {
    if (this.socket) {
      this.socket.on('chatUpdate', callback);
      this.listeners.set('chatUpdate', callback);
    }
  }

  // Listen for typing indicator
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
      this.listeners.set('userTyping', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('userStoppedTyping', callback);
      this.listeners.set('userStoppedTyping', callback);
    }
  }

  // Listen for messages read
  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on('messagesRead', callback);
      this.listeners.set('messagesRead', callback);
    }
  }

  // Listen for message sent confirmation
  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('messageSent', callback);
      this.listeners.set('messageSent', callback);
    }
  }

  // Listen for chat closed
  onChatClosed(callback) {
    if (this.socket) {
      this.socket.on('chatClosed', callback);
      this.listeners.set('chatClosed', callback);
    }
  }

  // Listen for joined chat confirmation
  onJoinedChat(callback) {
    if (this.socket) {
      this.socket.on('joinedChat', callback);
      this.listeners.set('joinedChat', callback);
    }
  }

  // Listen for joined branch confirmation
  onJoinedBranch(callback) {
    if (this.socket) {
      this.socket.on('joinedBranch', callback);
      this.listeners.set('joinedBranch', callback);
    }
  }

  // Remove a specific listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.connected && this.socket !== null;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
