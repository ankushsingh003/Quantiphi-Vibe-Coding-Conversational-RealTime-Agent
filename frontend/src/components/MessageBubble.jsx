import { useState } from 'react';
import './MessageBubble.css';

export default function MessageBubble({ role, content, isStreaming }) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`bubble-wrapper ${isUser ? 'user' : 'ai'}`}>
      {/* Avatar */}
      <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
        {isUser ? '👤' : '◈'}
      </div>

      {/* Bubble */}
      <div className={`bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
        <div className="bubble-content">
          {content}
          {isStreaming && <span className="cursor-blink">▋</span>}
        </div>
        {/* Copy button — only on AI messages, not while streaming */}
        {!isUser && !isStreaming && content && (
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            id={`copy-btn-${Math.random().toString(36).substr(2, 6)}`}
            title="Copy response"
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

