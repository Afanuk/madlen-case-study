import { useState, useRef } from 'react';
import { Input, Button, Space, Image, message as antMessage, Dropdown } from 'antd';
import { SendOutlined, PictureOutlined, CloseOutlined, MoreOutlined, RobotOutlined } from '@ant-design/icons';
import ModelSelector from './ModelSelector';
import './MessageInput.css';

const { TextArea } = Input;

function MessageInput({ onSendMessage, disabled, selectedModel, onModelChange }) {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() || imageFile) {
      onSendMessage(message, imageFile);
      setMessage('');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        antMessage.error('Lütfen sadece resim dosyası yükleyin');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        antMessage.error('Resim boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUploadClick = () => {
    setDropdownOpen(false);
    fileInputRef.current?.click();
  };

  const menuItems = [
    {
      key: 'model',
      icon: <RobotOutlined />,
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={(value) => {
              onModelChange(value);
              setDropdownOpen(false);
            }}
          />
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'image',
      icon: <PictureOutlined />,
      label: 'Upload Image',
      onClick: handleImageUploadClick,
    },
  ];

  return (
    <div className="message-input-container">
      {imagePreview && (
        <div className="image-preview-container">
          <div className="image-preview-wrapper">
            <Image
              src={imagePreview}
              alt="Preview"
              width={100}
              height={100}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleRemoveImage}
              className="remove-image-btn"
              size="small"
            />
          </div>
        </div>
      )}
      <Space.Compact style={{ width: '100%' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
          placement="topLeft"
          overlayClassName="more-actions-dropdown"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            disabled={disabled}
            size="large"
            className="more-actions-btn"
            title="More actions"
          />
        </Dropdown>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Madlen'a sorun"
          disabled={disabled}
          autoSize={{ minRows: 1, maxRows: 4 }}
          size="large"
          className="message-textarea"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !imageFile)}
          size="large"
          className="send-btn"
        />
      </Space.Compact>
    </div>
  );
}

export default MessageInput;
