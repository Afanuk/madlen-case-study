import { Typography } from 'antd';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import './MarkdownRenderer.css';

const { Paragraph, Title } = Typography;

function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';
            
            return !inline ? (
              <CodeBlock code={String(children).replace(/\n$/, '')} language={language} />
            ) : (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => <Title level={2}>{children}</Title>,
          h2: ({ children }) => <Title level={3}>{children}</Title>,
          h3: ({ children }) => <Title level={4}>{children}</Title>,
          p: ({ children }) => <Paragraph>{children}</Paragraph>,
          ul: ({ children }) => <ul className="markdown-list">{children}</ul>,
          ol: ({ children }) => <ol className="markdown-list">{children}</ol>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
