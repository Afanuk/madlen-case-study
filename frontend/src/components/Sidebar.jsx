import { Menu, Button } from 'antd';
import { 
  PlusOutlined, 
  ClockCircleOutlined, 
  SettingOutlined,
  EditOutlined,
  MessageOutlined
} from '@ant-design/icons';
import './Sidebar.css';

function Sidebar({ onNewChat, conversations }) {
  const menuItems = [
    {
      key: 'new',
      icon: <EditOutlined />,
      label: 'Yeni sohbet',
      onClick: onNewChat,
      className: 'new-chat-item'
    },
    {
      type: 'divider'
    },
    {
      key: 'recent',
      label: 'Öğelerim',
      type: 'group',
    },
    ...(conversations || []).map((conv, idx) => ({
      key: `conv-${idx}`,
      icon: <MessageOutlined />,
      label: conv.title || `Sohbet ${idx + 1}`,
    }))
  ];

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
            conversations.map((conv, idx) => (
              <div key={idx} className="conversation-item">
                <ClockCircleOutlined />
                <span>{conv.title || `Yardım İsteği ve Teklif`}</span>
              </div>
            ))
          ) : (
            <div className="conversation-item selected">
              <ClockCircleOutlined />
              <span>Yardım İsteği ve Teklif</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
