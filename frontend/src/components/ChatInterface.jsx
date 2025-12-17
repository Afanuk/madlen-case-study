import { useState, useEffect } from 'react';
import { Layout, Typography, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatInterface.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const hasMessages = messages.length > 0;

  // Show sidebar when messages exist
  useEffect(() => {
    if (hasMessages) {
      setSidebarVisible(true);
    }
  }, [hasMessages]);

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
      const response = await fetch('http://localhost:3000/api/chat', {
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
    <div className="app-container">
      {sidebarVisible && <Sidebar onNewChat={handleNewConversation} />}
      <Layout className="chat-interface">
        {hasMessages && (
          <Header className="chat-header">
            <div className="header-content">
              <Button 
                type="text" 
                icon={<MenuOutlined />} 
                className="menu-btn"
                onClick={() => setSidebarVisible(!sidebarVisible)}
              />
              <h1>Madlen</h1>
              <div className="header-actions">
                <span className="help-text">Yardım İsteği ve Teklif</span>
              </div>
            </div>
          </Header>
        )}
        <Content className={`chat-content ${!hasMessages ? 'centered' : ''}`}>
          {!hasMessages ? (
            <div className="welcome-screen">
              <div className="welcome-icon">✨</div>
              <Title level={2} className="welcome-title">Merhaba Ahmet Faruk</Title>
              <Title level={4} className="welcome-subtitle">Nereden başlayalım?</Title>
            </div>
          ) : (
            <MessageList messages={messages} loading={loading} />
          )}
        </Content>
        <Footer className="chat-footer">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={loading}
            onNewConversation={handleNewConversation}
            hasMessages={hasMessages}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </Footer>
      </Layout>
    </div>
  );
}

export default ChatInterface;
