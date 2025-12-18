import { useEffect, useRef } from 'react';
import { List, Avatar, Spin, Image } from 'antd';
import StreamingText from './StreamingText';
import './MessageList.css';

function MessageList({ messages, loading }) {
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Also scroll during streaming updates
  useEffect(() => {
    const timer = setInterval(() => {
      if (messages.some(m => m.isStreaming)) {
        scrollToBottom();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [messages]);

  return (
    <div className="message-list-container" ref={containerRef}>
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
                  {message.image && (
                    <div className="message-image">
                      <Image
                        src={message.image}
                        alt="Uploaded"
                        width={200}
                        style={{ borderRadius: '8px', marginBottom: '8px' }}
                      />
                    </div>
                  )}
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
    </div>
  );
}

export default MessageList;
