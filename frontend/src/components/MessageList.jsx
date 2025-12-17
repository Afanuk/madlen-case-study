import { useEffect, useRef } from 'react';
import { List, Avatar, Spin } from 'antd';
import { UserOutlined, RobotOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './MessageList.css';

function MessageList({ messages, loading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAvatar = (role) => {
    switch (role) {
      case 'user':
        return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />;
      case 'assistant':
        return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />;
      case 'system':
        return <Avatar icon={<ExclamationCircleOutlined />} style={{ backgroundColor: '#ff4d4f' }} />;
      default:
        return <Avatar icon={<UserOutlined />} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="message-list-container">
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(message) => (
          <List.Item className={`message-item message-${message.role}`}>
            <List.Item.Meta
              avatar={getAvatar(message.role)}
              title={
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : 'System'}
                  </span>
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                </div>
              }
              description={
                <div className="message-content">
                  {message.content}
                </div>
              }
            />
          </List.Item>
        )}
      />
      {loading && (
        <div className="loading-indicator">
          <Spin size="small" />
          <span style={{ marginLeft: '8px' }}>Assistant is typing...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
