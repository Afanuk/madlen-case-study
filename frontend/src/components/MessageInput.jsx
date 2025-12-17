import { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import './MessageInput.css';

const { TextArea } = Input;

function MessageInput({ onSendMessage, disabled, onNewConversation }) {
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
        <Button
          icon={<PlusOutlined />}
          onClick={onNewConversation}
          disabled={disabled}
          size="large"
        >
          New
        </Button>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          autoSize={{ minRows: 1, maxRows: 4 }}
          size="large"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="large"
        >
          Send
        </Button>
      </Space.Compact>
    </div>
  );
}

export default MessageInput;
