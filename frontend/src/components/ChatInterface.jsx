import { useState, useEffect } from 'react';
import { Layout, Typography, Button, message } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import chatAPI from '../api/chat';
import './ChatInterface.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [conversations, setConversations] = useState([]);
  const hasMessages = messages.length > 0;

  // Show sidebar when messages exist
  useEffect(() => {
    if (hasMessages) {
      setSidebarVisible(true);
    }
  }, [hasMessages]);

  // Fetch conversations on mount and when conversation changes
  useEffect(() => {
    fetchConversations();
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

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
      const data = await chatAPI.sendMessage(
        messageText,
        selectedModel,
        conversationId
      );
      
      // Update conversation ID if this is the first message
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Add assistant message with streaming flag
      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        fullContent: data.message,
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        role: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleSwitchConversation = async (convId) => {
    try {
      const data = await chatAPI.getConversation(convId);
      if (data.conversation) {
        setMessages(data.conversation.messages);
        setConversationId(convId);
        setSelectedModel(data.conversation.meta.model);
      }
    } catch (error) {
      console.error('Error switching conversation:', error);
      message.error('Failed to load conversation.');
    }
  };

  return (
    <div className="app-container">
      {sidebarVisible && (
        <Sidebar 
          onNewChat={handleNewConversation} 
          conversations={conversations}
          currentConversationId={conversationId}
          onSwitchConversation={handleSwitchConversation}
        />
      )}
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
