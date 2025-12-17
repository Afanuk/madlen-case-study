import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import './ChatInterface.css';

const { Header, Content, Footer } = Layout;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          model: selectedModel,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update conversation ID if this is the first message
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Add assistant message
      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage = {
        role: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <Layout className="chat-interface">
      <Header className="chat-header">
        <div className="header-content">
          <h1>Madlen Chat</h1>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </Header>
      <Content className="chat-content">
        <MessageList messages={messages} loading={loading} />
      </Content>
      <Footer className="chat-footer">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={loading}
          onNewConversation={handleNewConversation}
        />
      </Footer>
    </Layout>
  );
}

export default ChatInterface;
