import './MessageBubble.css';

export default function MessageBubble({ role, content, isStreaming }) {
  const isUser = role === 'user';

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
      </div>
    </div>
  );
}
