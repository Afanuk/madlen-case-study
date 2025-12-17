import { useEffect, useRef } from 'react';
import { List, Avatar, Spin, Button } from 'antd';
import { 
  LikeOutlined,
  DislikeOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  MoreOutlined
} from '@ant-design/icons';
import StreamingText from './StreamingText';
import './MessageList.css';

function MessageList({ messages, loading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list-container">
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(message, index) => (
          <div className={`message-wrapper message-${message.role}-wrapper`}>
            <List.Item className={`message-item message-${message.role}`}>
              <div className="message-row">
                {message.role === 'assistant' && (
                  <Avatar className="message-avatar-icon">⭐</Avatar>
                )}
                <div className="message-body">
                  <div className="message-content">
                    {message.isStreaming ? (
                      <StreamingText 
                        text={message.fullContent || message.content} 
                        delay={5}
                      />
                    ) : (
                      message.content
                    )}
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
