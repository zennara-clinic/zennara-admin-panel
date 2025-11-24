import api, { API_BASE_URL } from '../config/api';

const CHAT_API = `${API_BASE_URL}/api/chat`;

class ChatService {
  // Get all chats for a specific branch
  async getChatsByBranch(branchId, status = 'active', page = 1, limit = 50) {
    try {
      const response = await api.get(`${CHAT_API}/admin/branch/${branchId}`, {
        params: { status, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chats by branch:', error);
      throw error;
    }
  }

  // Get messages for a specific chat
  async getChatMessages(chatId, page = 1, limit = 50) {
    try {
      const response = await api.get(`${CHAT_API}/${chatId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  // Send a message (admin)
  async sendMessage(chatId, content, messageType = 'text') {
    try {
      const response = await api.post(`${CHAT_API}/${chatId}/messages`, {
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark chat as read
  async markChatAsRead(chatId) {
    try {
      const response = await api.put(`${CHAT_API}/admin/${chatId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking chat as read:', error);
      throw error;
    }
  }

  // Close chat
  async closeChat(chatId) {
    try {
      const response = await api.put(`${CHAT_API}/admin/${chatId}/close`);
      return response.data;
    } catch (error) {
      console.error('Error closing chat:', error);
      throw error;
    }
  }

  // Get chat statistics
  async getChatStats(branchId = null) {
    try {
      const response = await api.get(`${CHAT_API}/admin/stats`, {
        params: branchId ? { branchId } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }

  // Assign chat to admin
  async assignChat(chatId, adminId) {
    try {
      const response = await api.put(`${CHAT_API}/admin/${chatId}/assign`, {
        adminId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning chat:', error);
      throw error;
    }
  }
}

export default new ChatService();
