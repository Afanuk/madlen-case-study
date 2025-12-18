import { Button } from 'antd';
import { 
  PlusOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import './Sidebar.css';

function Sidebar({ onNewChat, conversations, currentConversationId, onSwitchConversation }) {
  const getConversationTitle = (conv) => {
    // Use first user message as title (truncated)
    if (!conv || !conv.messages || conv.messages.length === 0) {
      return 'Yeni Sohbet';
    }
    
    // Find first user message
    const firstUserMessage = conv.messages.find(msg => msg.role === 'user');
    if (firstUserMessage && firstUserMessage.content) {
      // Truncate to 30 characters
      const text = firstUserMessage.content.trim();
      return text.length > 30 ? text.substring(0, 30) + '...' : text;
    }
    
    return `Sohbet ${conv.id.split('_')[1]?.slice(-4) || ''}`;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Madlen</h2>
      </div>
      <Button 
        type="text" 
        icon={<PlusOutlined />} 
        className="new-chat-btn"
        onClick={onNewChat}
        block
      >
        Yeni sohbet
      </Button>
      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-section-title">Sohbetler</div>
          {conversations && conversations.length > 0 ? (
            conversations.map((conv) => (
              <div 
                key={conv.id} 
                className={`conversation-item ${conv.id === currentConversationId ? 'selected' : ''}`}
                onClick={() => onSwitchConversation(conv.id)}
              >
                <ClockCircleOutlined />
                <span>{getConversationTitle(conv)}</span>
              </div>
            ))
          ) : (
            <div className="conversation-item-empty">
              <span>Henüz sohbet yok</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
