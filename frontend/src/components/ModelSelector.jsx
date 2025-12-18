import { useState, useEffect } from 'react';
import { Select, message } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import chatAPI from '../api/chat';
import './ModelSelector.css';

const { Option } = Select;

function ModelSelector({ selectedModel, onModelChange }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const data = await chatAPI.getModels();
      setModels(data.models);
    } catch (error) {
      console.error('Error fetching models:', error);
      message.error('Failed to load models. Using default model.');
      // Fallback to default model list
      setModels([
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'openai/gpt-4', name: 'GPT-4' },
        { id: 'anthropic/claude-2', name: 'Claude 2' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="model-selector">
      <Select
        value={selectedModel}
        onChange={onModelChange}
        loading={loading}
        style={{ minWidth: 220 }}
        size="middle"
        placeholder="Select a model"
        dropdownStyle={{ minWidth: 250 }}
      >
        {models.map((model) => (
          <Option key={model.id} value={model.id}>
            {model.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default ModelSelector;
