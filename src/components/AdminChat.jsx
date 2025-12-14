import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import chatService from '../services/chatService';
import socketService from '../services/socketService';

const AdminChat = ({ selectedBranch }) => {
  const [activeChats, setActiveChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(() => {
    // Load selected chat from localStorage on mount
    const savedChatId = localStorage.getItem('selectedChatId');
    return savedChatId ? { _id: savedChatId } : null;
  });
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({}); // Track online status for all users by chatId
  const [updateCounter, setUpdateCounter] = useState(0); // For forcing re-renders
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const userTypingTimeoutRef = useRef(null); // For tracking user typing indicator timeout
  const branchJoinTimeoutRef = useRef(null); // For tracking branch join timeout
  const chatJoinTimeoutRef = useRef(null); // For tracking chat join timeout
  const currentChatIdRef = useRef(null);
  const previousBranchIdRef = useRef(null);
  const selectedChatRef = useRef(null);

  // Monitor onlineUsers changes
  useEffect(() => {
    console.log('🔄 onlineUsers state changed:', onlineUsers);
    console.log('   Number of tracked users:', Object.keys(onlineUsers).length);
    Object.entries(onlineUsers).forEach(([chatId, status]) => {
      console.log(`   - Chat ${chatId}: ${status.online ? 'ONLINE' : 'OFFLINE'}`);
    });
  }, [onlineUsers]);

  // Initialize socket connection and setup listeners ONCE
  useEffect(() => {
    const initSocket = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      console.log('Setting up admin socket connection...');
      
      // Connect socket if not already connected
      if (!socketService.isConnected()) {
        console.log('Connecting admin socket...');
        try {
          await socketService.connectAsync(token);
          console.log('✅ Admin socket connected successfully');
        } catch (error) {
          console.error('❌ Failed to connect admin socket:', error);
        }
      } else {
        console.log('✅ Socket already connected');
      }
    };

    initSocket();

    return () => {
      // Clean up all timeouts
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (userTypingTimeoutRef.current) clearTimeout(userTypingTimeoutRef.current);
      if (branchJoinTimeoutRef.current) clearTimeout(branchJoinTimeoutRef.current);
      if (chatJoinTimeoutRef.current) clearTimeout(chatJoinTimeoutRef.current);
      
      // Leave rooms
      if (selectedChat) {
        socketService.leaveChat(selectedChat._id);
      }
      if (selectedBranch) {
        socketService.leaveBranch(selectedBranch.id);
      }
    };
  }, []);

  // Fetch chats for selected branch
  useEffect(() => {
    if (selectedBranch) {
      // Clear selected chat only when branch actually changes (not on initial load)
      if (previousBranchIdRef.current && previousBranchIdRef.current !== selectedBranch.id) {
        setSelectedChat(null);
        localStorage.removeItem('selectedChatId');
      }
      previousBranchIdRef.current = selectedBranch.id;
      
      fetchChats();
      // Join branch room for real-time updates only if socket is connected
      if (socketService.isConnected()) {
        console.log('Admin joining branch room:', selectedBranch.id);
        socketService.joinBranch(selectedBranch.id);
      } else {
        console.log('Socket not connected yet, will join branch room later');
        // Clear existing timeout if any
        if (branchJoinTimeoutRef.current) {
          clearTimeout(branchJoinTimeoutRef.current);
        }
        // Try to join after a short delay
        branchJoinTimeoutRef.current = setTimeout(() => {
          if (socketService.isConnected()) {
            socketService.joinBranch(selectedBranch.id);
          }
          branchJoinTimeoutRef.current = null;
        }, 2000);
      }
    }
    
    // Cleanup when branch changes or component unmounts
    return () => {
      if (branchJoinTimeoutRef.current) {
        clearTimeout(branchJoinTimeoutRef.current);
        branchJoinTimeoutRef.current = null;
      }
    };
  }, [selectedBranch]);

  // Restore selected chat after fetching chats
  useEffect(() => {
    const savedChatId = localStorage.getItem('selectedChatId');
    if (savedChatId && activeChats.length > 0) {
      const chatToRestore = activeChats.find(chat => chat._id === savedChatId);
      if (chatToRestore) {
        setSelectedChat(chatToRestore);
      }
    }
  }, [activeChats]);

  // Fetch chat messages when chat is selected
  useEffect(() => {
    const previousChat = selectedChatRef.current;
    
    if (selectedChat) {
      console.log('📋 Selected chat:', selectedChat.name, selectedChat._id);
      
      // Only proceed if this is actually a different chat
      if (!previousChat || previousChat._id !== selectedChat._id) {
        // Leave previous chat room if exists
        if (previousChat) {
          console.log('🚪 Leaving previous chat room:', previousChat._id);
          socketService.leaveChat(previousChat._id);
        }
        
        // Clear typing indicators and timeouts when switching chats
        setIsTyping(false);
        if (userTypingTimeoutRef.current) {
          clearTimeout(userTypingTimeoutRef.current);
          userTypingTimeoutRef.current = null;
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        
        // Update ref
        selectedChatRef.current = selectedChat;
        
        // Clear messages when switching chats
        setMessages([]);
        
        // Fetch messages for this chat
        fetchMessages();
        
        // Join chat room only if socket is connected
        if (socketService.isConnected()) {
          console.log('Admin joining chat room:', selectedChat._id);
          socketService.joinChat(selectedChat._id);
          // Mark as read
          socketService.markAsRead(selectedChat._id);
        } else {
          console.log('Socket not connected, retrying in 1s...');
          // Clear existing timeout if any
          if (chatJoinTimeoutRef.current) {
            clearTimeout(chatJoinTimeoutRef.current);
          }
          chatJoinTimeoutRef.current = setTimeout(() => {
            if (socketService.isConnected()) {
              socketService.joinChat(selectedChat._id);
              socketService.markAsRead(selectedChat._id);
            }
            chatJoinTimeoutRef.current = null;
          }, 1000);
        }
      }
    }
    
    // Cleanup when chat is deselected or component unmounts
    return () => {
      if (chatJoinTimeoutRef.current) {
        clearTimeout(chatJoinTimeoutRef.current);
        chatJoinTimeoutRef.current = null;
      }
      if (userTypingTimeoutRef.current) {
        clearTimeout(userTypingTimeoutRef.current);
        userTypingTimeoutRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [selectedChat]);

  // Update online status when it changes for the selected chat
  useEffect(() => {
    if (selectedChat && onlineUsers[selectedChat._id]) {
      const presenceInfo = onlineUsers[selectedChat._id];
      setUserOnline(presenceInfo.online);
      setLastSeen(presenceInfo.lastSeen);
    }
  }, [onlineUsers, selectedChat]);

  // Socket event listeners - SET UP ONCE on mount, not recreated on chat change
  useEffect(() => {
    console.log('Setting up socket listeners (ONCE)...');
    console.log('Socket connected status:', socketService.isConnected());

    socketService.onNewMessage((message) => {
      console.log('✉️ Admin received new message:', message);
      
      // Update messages if this is for the currently selected chat
      const currentChat = selectedChatRef.current;
      if (currentChat && message.chatId === currentChat._id) {
        setMessages(prev => {
          // Prevent duplicate messages (check both real IDs and temp IDs)
          const exists = prev.some(msg => {
            // Check if it's the same message by ID
            if (msg._id === message._id) return true;
            // Check if it's a temp message that matches content and is recent (within 5 seconds)
            if (msg._id.startsWith('temp-') && 
                msg.content === message.content && 
                msg.senderModel === message.senderModel) {
              const msgTime = new Date(msg.createdAt).getTime();
              const newMsgTime = new Date(message.createdAt).getTime();
              if (Math.abs(msgTime - newMsgTime) < 5000) return true;
            }
            return false;
          });
          if (exists) {
            console.log('Duplicate message detected, skipping');
            return prev;
          }
          console.log('✅ Adding new message to chat');
          return [...prev, message];
        });
      } else {
        console.log('Message not for current chat, updating chat list only');
      }
    });

    // Handle message sent confirmation (replace temp message with real one)
    socketService.getSocket()?.on('messageSent', (data) => {
      console.log('✅ Admin message sent confirmation:', data);
      if (data.tempId) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === data.tempId 
              ? { ...msg, _id: data.messageId, isDelivered: true, deliveredAt: new Date().toISOString() }
              : msg
          )
        );
      }
    });

    // Handle message deleted
    socketService.getSocket()?.on('messageDeleted', (data) => {
      console.log('🗑️ Message deleted:', data);
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    });

    socketService.onChatUpdate((update) => {
      console.log('📊 Chat update received:', update);
      // Update chat list with new message or unread count
      setActiveChats(prev => prev.map(chat => 
        chat._id === update.chatId 
          ? { 
              ...chat, 
              lastMessage: update.lastMessage || chat.lastMessage,
              unreadCount: update.unreadCount !== undefined ? update.unreadCount : chat.unreadCount,
              timestamp: update.lastMessageTime ? formatTimestamp(update.lastMessageTime) : chat.timestamp
            }
          : chat
      ));
    });

    // Typing indicator with auto-timeout
    socketService.onUserTyping((data) => {
      console.log('⌨️ User typing event received:', data);
      
      const currentChat = selectedChatRef.current;
      // Show typing indicator only if it's from a user (not from another admin)
      if (currentChat && data.chatId === currentChat._id && data.userType === 'user') {
        console.log('✅ User is typing in current chat - showing indicator');
        setIsTyping(true);
        
        // Auto-clear typing indicator after 3 seconds
        if (userTypingTimeoutRef.current) clearTimeout(userTypingTimeoutRef.current);
        userTypingTimeoutRef.current = setTimeout(() => {
          console.log('⏱️ Auto-clearing typing indicator');
          setIsTyping(false);
          userTypingTimeoutRef.current = null;
        }, 3000);
      } else {
        console.log('❌ Typing event not for current chat or from admin', {
          currentChatId: currentChat?._id,
          eventChatId: data.chatId,
          userType: data.userType
        });
      }
    });

    socketService.onUserStoppedTyping((data) => {
      console.log('⏹️ User stopped typing event:', data);
      
      const currentChat = selectedChatRef.current;
      if (currentChat && data.chatId === currentChat._id) {
        console.log('✅ Clearing typing indicator');
        if (userTypingTimeoutRef.current) {
          clearTimeout(userTypingTimeoutRef.current);
          userTypingTimeoutRef.current = null;
        }
        setIsTyping(false);
      }
    });

    // User presence tracking - Track for ALL chats
    socketService.getSocket()?.on('userPresenceChanged', (data) => {
      console.log('='.repeat(60));
      console.log('👁️ USER PRESENCE CHANGED EVENT RECEIVED');
      console.log('   Chat ID:', data.chatId);
      console.log('   Online:', data.online);
      console.log('   User:', data.userName);
      console.log('   Last Seen:', data.lastSeen);
      console.log('='.repeat(60));
      
      // Update global online users map - CREATE NEW OBJECT to trigger re-render
      setOnlineUsers(prev => {
        // Create completely new object to ensure React detects the change
        const updated = { ...prev };
        updated[data.chatId] = {
          online: data.online,
          lastSeen: data.lastSeen
        };
        console.log('📊 Updated onlineUsers map:', updated);
        return updated;
      });
      
      // Force re-render by incrementing counter
      setUpdateCounter(c => c + 1);
      
      // Also update selected chat state if it's the current one
      const currentChat = selectedChatRef.current;
      console.log('🔍 Current selected chat:', currentChat?._id);
      if (currentChat && data.chatId === currentChat._id) {
        console.log(`✅ UPDATING SELECTED CHAT HEADER - Setting online to: ${data.online}`);
        setUserOnline(data.online);
        setLastSeen(data.lastSeen);
      } else {
        console.log('⏭️ Presence event not for current chat, only updating global map');
      }
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      // Clear all timeout refs
      if (userTypingTimeoutRef.current) clearTimeout(userTypingTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (branchJoinTimeoutRef.current) clearTimeout(branchJoinTimeoutRef.current);
      if (chatJoinTimeoutRef.current) clearTimeout(chatJoinTimeoutRef.current);
      
      // Remove socket listeners
      socketService.removeAllListeners();
      socketService.getSocket()?.off('userPresenceChanged');
      socketService.getSocket()?.off('messageSent');
      socketService.getSocket()?.off('messageDeleted');
    };
  }, []); // Empty dependency array - only run once on mount

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatsByBranch(selectedBranch.id);
      const chats = response.data || [];
      
      // Format chats for UI
      const formattedChats = chats.map(chat => ({
        ...chat,
        avatar: chat.userId?.fullName?.[0]?.toUpperCase() || 'U',
        name: chat.userId?.fullName || 'Unknown User',
        online: true, // TODO: Implement online status
        timestamp: formatTimestamp(chat.lastMessageTime)
      }));
      
      console.log('📊 Fetched chats:', formattedChats.map(c => ({ id: c._id, name: c.name })));
      
      setActiveChats(formattedChats);
      // Don't auto-select first chat - let admin choose manually
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    
    try {
      const response = await chatService.getChatMessages(selectedChat._id);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now - messageDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    // Handle negative values (future timestamps due to clock differences) or very recent
    if (diffInMinutes <= 0 || diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInHours < 1) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const formatLastSeen = (date) => {
    if (!date) return '';
    const now = new Date();
    const lastSeenDate = new Date(date);
    const diffInMs = now - lastSeenDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Handle very recent (under 1 minute)
    if (diffInMinutes < 1) {
      return 'just now';
    } 
    // Under 1 hour - show minutes
    else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } 
    // Under 24 hours - show "today at HH:MM"
    else if (diffInHours < 24) {
      const timeStr = lastSeenDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `today at ${timeStr}`;
    } 
    // Yesterday
    else if (diffInDays === 1) {
      const timeStr = lastSeenDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `yesterday at ${timeStr}`;
    }
    // Within a week - show day name and time
    else if (diffInDays < 7) {
      const dayName = lastSeenDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = lastSeenDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `${dayName} at ${timeStr}`;
    }
    // More than a week - show date and time
    else {
      const dateStr = lastSeenDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const timeStr = lastSeenDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `${dateStr} at ${timeStr}`;
    }
  };

  // Remove the old hardcoded data
  const oldAllChats = [
    // Jubilee Hills
    {
      id: 1,
      name: 'Minto',
      lastMessage: 'Great! Can I book an appointment for tomorrow?',
      timestamp: '10:33 AM',
      unread: 2,
      avatar: 'M',
      branch: 'Jubilee Hills',
      online: true,
    },
    {
      id: 2,
      name: 'Ananya Reddy',
      lastMessage: 'What are the timings for Saturday?',
      timestamp: '11:15 AM',
      unread: 1,
      avatar: 'A',
      branch: 'Jubilee Hills',
      online: true,
    },
    {
      id: 3,
      name: 'Vikram Singh',
      lastMessage: 'Thank you for the help!',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: 'V',
      branch: 'Jubilee Hills',
      online: false,
    },
    // Financial District
    {
      id: 4,
      name: 'Priya Sharma',
      lastMessage: 'Do you have hair treatment services?',
      timestamp: '9:45 AM',
      unread: 1,
      avatar: 'P',
      branch: 'Financial District',
      online: true,
    },
    {
      id: 5,
      name: 'Arjun Patel',
      lastMessage: 'I need to reschedule my appointment',
      timestamp: '2 hours ago',
      unread: 0,
      avatar: 'A',
      branch: 'Financial District',
      online: false,
    },
    // Kondapur
    {
      id: 6,
      name: 'Rahul Kumar',
      lastMessage: 'Is the clinic open on Sunday?',
      timestamp: 'Just now',
      unread: 1,
      avatar: 'R',
      branch: 'Kondapur',
      online: true,
    },
    {
      id: 7,
      name: 'Sneha Iyer',
      lastMessage: 'Can I get a prescription refill?',
      timestamp: '30 mins ago',
      unread: 3,
      avatar: 'S',
      branch: 'Kondapur',
      online: true,
    },
    {
      id: 8,
      name: 'Karthik Menon',
      lastMessage: 'What is the cost for acne treatment?',
      timestamp: '1 hour ago',
      unread: 2,
      avatar: 'K',
      branch: 'Kondapur',
      online: true,
    },
    {
      id: 9,
      name: 'Divya Rao',
      lastMessage: 'Thanks for the consultation',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: 'D',
      branch: 'Kondapur',
      online: false,
    },
  ]; // End of old data

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Smart auto-scroll: only scroll to bottom if user is already near the bottom
  useEffect(() => {
    const messageContainer = messagesEndRef.current?.parentElement?.parentElement;
    if (!messageContainer) return;

    // Check if user is scrolled near the bottom (within 100px)
    const isNearBottom = 
      messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight < 100;

    // Only auto-scroll if user is already at the bottom
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      
      // Optimistically add message to UI
      const tempMessage = {
        _id: `temp-${Date.now()}`,
        content: newMessage,
        senderModel: 'Admin',
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      
      setMessages(prev => [...prev, tempMessage]);
      const messageContent = newMessage;
      setNewMessage('');
      
      // Scroll to bottom to show the new message
      setTimeout(() => scrollToBottom(), 100);

      // Send via socket for real-time delivery
      socketService.sendMessage({
        chatId: selectedChat._id,
        content: messageContent,
        messageType: 'text',
        tempId: tempMessage._id
      });

      // Note: Removed API backup call to prevent duplicate messages
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert on error
      setNewMessage(newMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (!selectedChat) return;
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      // Delete via socket
      socketService.getSocket()?.emit('deleteMessage', {
        messageId,
        chatId: selectedChat._id
      });
      
      console.log(`🗑️ Deleting message: ${messageId}`);
    }
  };

  const handleTyping = () => {
    if (selectedChat) {
      socketService.startTyping(selectedChat._id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(selectedChat._id);
      }, 2000);
    }
  };

  const ChatListItem = ({ chat, onlineStatus }) => {
    // Use real-time online status from prop
    const chatId = chat._id || chat.id;
    const isOnline = onlineStatus?.online ?? false;
    
    console.log(`📊 ChatListItem render - Chat: ${chat.name}, ID: ${chatId}, Online: ${isOnline}, UpdateCounter: ${updateCounter}`);
    
    return (
      <div
        onClick={() => {
          setSelectedChat(chat);
          // Save to localStorage
          localStorage.setItem('selectedChatId', chat._id);
        }}
        className={`flex items-center gap-3 px-4 py-3.5 mx-2 my-1 cursor-pointer transition-all duration-200 rounded-xl border-l-3 ${
          selectedChat?._id === chat._id
            ? 'bg-gradient-to-r from-emerald-50 to-white border-zennara-green shadow-sm'
            : 'hover:bg-gray-50/80 border-transparent hover:shadow-sm'
        }`}
      >
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-zennara-green to-emerald-600 text-white font-semibold text-base shadow-md">
            {chat.avatar}
          </div>
          {isOnline && (
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{chat.name}</h4>
            <span className="text-xs text-gray-400 flex-shrink-0 font-medium">{chat.timestamp}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            {chat.unreadCount > 0 && (
              <span className="bg-gradient-to-r from-zennara-green to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 min-w-[22px] text-center shadow-sm">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100 bg-gradient-to-r from-zennara-green to-emerald-600">
          <h2 className="text-lg font-bold text-white">{selectedBranch.name}</h2>
          <p className="text-xs text-emerald-50 mt-1 font-medium">{activeChats.length} active conversations</p>
        </div>

        {/* Search */}
        <div className="px-4 py-4 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green/30 focus:border-zennara-green focus:bg-white transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {activeChats.length > 0 ? (
            <div className="py-2">
              {activeChats.map((chat) => {
                const chatId = chat._id || chat.id;
                return (
                  <ChatListItem 
                    key={chatId} 
                    chat={chat} 
                    onlineStatus={onlineUsers[chatId]} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-4 shadow-sm">
                <MessageCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">No conversations</h3>
              <p className="text-sm text-gray-500 max-w-[200px]">
                No active chats for {selectedBranch.name} yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
        {/* Chat Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zennara-green to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {selectedChat.avatar}
              </div>
              {userOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-3 border-white rounded-full animate-pulse shadow-md" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{selectedChat.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
                {userOnline ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-600 font-medium">Active now</span>
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Last seen {lastSeen ? formatLastSeen(lastSeen) : 'recently'}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderModel === 'Admin' ? 'justify-end' : 'justify-start'} animate-fadeIn group`}
              >
                <div className="flex flex-col max-w-[75%]">
                  <div className="relative">
                    <div
                      className={`${
                        msg.senderModel === 'Admin'
                          ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl rounded-br-sm shadow-md'
                          : 'bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm'
                      } px-5 py-3 transition-all hover:shadow-lg`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.senderModel === 'Admin' && !msg._id.startsWith('temp-') && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-full"
                        title="Delete message"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1.5 px-2 ${
                    msg.senderModel === 'Admin' ? 'justify-end' : 'justify-start'
                  }`}>
                    <p className="text-xs text-gray-400 font-medium">
                      {formatTimestamp(msg.createdAt)}
                    </p>
                    {msg.senderModel === 'Admin' && msg.isRead && (
                      <span className="text-xs text-emerald-500">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3.5 border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-zennara-green rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-zennara-green rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
                    <div className="w-2.5 h-2.5 bg-zennara-green rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-5 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full px-5 py-3.5 bg-white border-2 border-gray-200 rounded-3xl text-sm resize-none focus:outline-none focus:border-zennara-green focus:ring-4 focus:ring-zennara-green/10 transition-all placeholder-gray-400 shadow-sm hover:shadow-md"
                  rows="1"
                  disabled={sendingMessage}
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className={`px-6 py-3 rounded-full transition-all flex items-center justify-center flex-shrink-0 shadow-md font-semibold text-sm ${
                  newMessage.trim() && !sendingMessage
                    ? 'bg-gradient-to-br from-zennara-green to-emerald-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title="Send message"
              >
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
            </form>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-700">Connected to {selectedBranch.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                <p className="text-xs text-gray-400 font-medium">Press Enter to send</p>
                <div className="h-1 w-1 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
        </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-5 shadow-md">
              <MessageCircle size={36} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Choose a chat from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
