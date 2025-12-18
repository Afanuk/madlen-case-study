const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Retry logic for failed requests
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const chatAPI = {
  async sendMessage(message, model, conversationId = null, imageFile = null) {
    let body;
    let headers = {};

    if (imageFile) {
      // Use FormData for multipart/form-data when image is present
      const formData = new FormData();
      formData.append('message', message);
      formData.append('model', model);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }
      formData.append('image', imageFile);
      body = formData;
      // Don't set Content-Type header, let browser set it with boundary
    } else {
      // Use JSON for text-only messages
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        message,
        model,
        conversationId,
      });
    }

    const response = await fetchWithRetry(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
    }

    return response.json();
  },

  async getModels() {
    const response = await fetchWithRetry(`${API_BASE_URL}/models`);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    return response.json();
  },

  async getConversations() {
    const response = await fetchWithRetry(`${API_BASE_URL}/conversations`);

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }

    return response.json();
  },

  async getConversation(conversationId) {
    const response = await fetchWithRetry(`${API_BASE_URL}/conversations/${conversationId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }

    return response.json();
  },
};

export default chatAPI;
