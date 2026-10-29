import './Sidebar.css';

const TONES = [
  { id: 'professional', label: 'Professional', icon: '🏢', desc: 'Formal & precise' },
  { id: 'casual',       label: 'Casual',       icon: '😎', desc: 'Friendly & relaxed' },
  { id: 'concise',      label: 'Concise',      icon: '⚡', desc: 'Short & direct' },
];

export default function Sidebar({ threads, activeThreadId, tone, onSelectThread, onNewChat, onToneChange }) {
  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Quantiphi</span>
        </div>
        <button className="new-chat-btn" onClick={onNewChat} id="new-chat-btn" title="New Chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      {/* Tone Toggle — The Vibe Check */}
      <div className="tone-section">
        <p className="section-label">🎛️ Tone</p>
        <div className="tone-options">
          {TONES.map(t => (
            <button
              key={t.id}
              id={`tone-${t.id}`}
              className={`tone-btn ${tone === t.id ? 'active' : ''}`}
              onClick={() => onToneChange(t.id)}
              title={t.desc}
            >
              <span className="tone-icon">{t.icon}</span>
              <span className="tone-label">{t.label}</span>
              {tone === t.id && <span className="tone-active-dot" />}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="threads-section">
        <p className="section-label">💬 History</p>
        <div className="threads-list">
          {threads.length === 0 ? (
            <div className="empty-threads">
              <span>No conversations yet</span>
              <span className="empty-sub">Start a new chat above</span>
            </div>
          ) : (
            threads.map(thread => (
              <button
                key={thread.thread_id}
                id={`thread-${thread.thread_id}`}
                className={`thread-item ${activeThreadId === thread.thread_id ? 'active' : ''}`}
                onClick={() => onSelectThread(thread.thread_id)}
              >
                <span className="thread-icon">💬</span>
                <div className="thread-info">
                  <span className="thread-title">{thread.title || 'Untitled'}</span>
                  <span className="thread-date">
                    {new Date(thread.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
