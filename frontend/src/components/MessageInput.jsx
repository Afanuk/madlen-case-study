import { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ModelSelector from './ModelSelector';
import './MessageInput.css';

const { TextArea } = Input;

function MessageInput({ onSendMessage, disabled, selectedModel, onModelChange }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <Space.Compact style={{ width: '100%' }}>
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Gemini'a sorun"
          disabled={disabled}
          autoSize={{ minRows: 1, maxRows: 4 }}
          size="large"
          className="message-textarea"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="large"
          className="send-btn"
        />
      </Space.Compact>
    </div>
  );
}

export default MessageInput;
