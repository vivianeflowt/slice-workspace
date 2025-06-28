import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute px-2 py-1 text-xs text-white transition bg-gray-800 rounded top-2 right-2 hover:bg-blue-600"
      title="Copiar código"
    >
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
};

export function MarkdownBox({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none relative bg-[#181c23] p-4 rounded-lg border border-[#23272e]">
      <ReactMarkdown
        components={{
          code(props: any) {
            const { inline, className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            const codeStr = String(children).replace(/\n$/, '');
            if (!inline) {
              return (
                <div className="relative group">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match ? match[1] : ''}
                    PreTag="div"
                    className="rounded-md text-sm"
                  >
                    {codeStr}
                  </SyntaxHighlighter>
                  <CopyButton code={codeStr} />
                </div>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownBox;
