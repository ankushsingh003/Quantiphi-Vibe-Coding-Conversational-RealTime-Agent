import { useState, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useAutoScroll } from '../hooks/useAutoScroll';
import './ChatWindow.css';

const TONE_LABELS = {
  professional: { icon: '🏢', label: 'Professional' },
  casual:       { icon: '😎', label: 'Casual' },
  concise:      { icon: '⚡', label: 'Concise' },
};

export default function ChatWindow({ messages, streamingContent, isStreaming, tone, onSend, isConnected }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const scrollRef = useAutoScroll([messages, streamingContent]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentTone = TONE_LABELS[tone] || TONE_LABELS.professional;

  return (
    <div className="chat-window">
      {/* Top bar */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`} />
          <span className="chat-header-title">AI Chat</span>
        </div>
        <div className="tone-badge">
          <span>{currentTone.icon}</span>
          <span>{currentTone.label} Mode</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="messages-area" ref={scrollRef}>
        {messages.length === 0 && !isStreaming ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">◈</div>
            <h2 className="empty-chat-title">How can I help you today?</h2>
            <p className="empty-chat-sub">
              Currently in <strong>{currentTone.icon} {currentTone.label}</strong> mode.
              Switch tones in the sidebar anytime.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                isStreaming={false}
              />
            ))}
            {/* Streaming bubble */}
            {isStreaming && streamingContent && (
              <MessageBubble
                role="assistant"
                content={streamingContent}
                isStreaming={true}
              />
            )}
            {/* Loading dots when streaming but no content yet */}
            {isStreaming && !streamingContent && (
              <div className="typing-indicator">
                <div className="bubble-wrapper ai">
                  <div className="avatar ai-avatar">◈</div>
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isStreaming}
          />
          <button
            id="send-btn"
            className={`send-btn ${isStreaming ? 'streaming' : ''}`}
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            title="Send message"
          >
            {isStreaming ? (
              <div className="send-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </div>
        <p className="input-hint">Powered by OpenAI GPT-4o · Real-time streaming</p>
      </div>
    </div>
  );
}
