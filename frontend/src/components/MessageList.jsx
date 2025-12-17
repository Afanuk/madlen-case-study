import { useEffect, useRef } from 'react';
import { List, Avatar, Spin, Button, Dropdown } from 'antd';
import { 
  UserOutlined, 
  RobotOutlined, 
  ExclamationCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  DownOutlined
} from '@ant-design/icons';
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

  const responseMenuItems = [
    {
      key: '1',
      label: 'Düşünme sürecini göster',
    },
    {
      key: '2', 
      label: 'Daha kısa',
    },
    {
      key: '3',
      label: 'Daha uzun',
    },
    {
      key: '4',
      label: 'Daha basit',
    },
    {
      key: '5',
      label: 'Daha resmi',
    },
  ];

  return (
    <div className="message-list-container">
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(message, index) => (
          <div className="message-wrapper">
            {message.role === 'user' && (
              <div className="message-label">Merhaba</div>
            )}
            <List.Item className={`message-item message-${message.role}`}>
              <div className="message-row">
                {message.role === 'assistant' && (
                  <Avatar className="message-avatar-icon">⭐</Avatar>
                )}
                <div className="message-body">
                  <div className="message-content">
                    {message.content}
                  </div>
                  {message.role === 'assistant' && (
                    <>
                      <div className="message-actions">
                        <Button type="text" icon={<LikeOutlined />} className="action-btn" />
                        <Button type="text" icon={<DislikeOutlined />} className="action-btn" />
                        <Button type="text" icon={<ReloadOutlined />} className="action-btn" />
                        <Button type="text" icon={<ShareAltOutlined />} className="action-btn" />
                        <Button type="text" icon={<MoreOutlined />} className="action-btn" />
                      </div>
                      <Dropdown menu={{ items: responseMenuItems }} trigger={['click']}>
                        <Button type="text" className="edit-response-btn">
                          Düşünme sürecini göster <DownOutlined />
                        </Button>
                      </Dropdown>
                    </>
                  )}
                </div>
              </div>
            </List.Item>
          </div>
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
