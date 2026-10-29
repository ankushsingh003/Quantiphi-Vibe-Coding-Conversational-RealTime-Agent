import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useWebSocket } from './hooks/useWebSocket';
import './index.css';
import './App.css';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [threads, setThreads]               = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages]             = useState([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming]        = useState(false);
  const [tone, setTone]                      = useState('professional');
  const [connected, setConnected]            = useState(false);

  const firstMessageRef = useRef(null); // track first msg for title generation

  // ---- WebSocket handlers ----
  const handleChunk = useCallback((chunk) => {
    setStreamingContent(prev => prev + chunk);
  }, []);

  const handleDone = useCallback((fullContent) => {
    setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
    setStreamingContent('');
    setIsStreaming(false);
    fetchThreads(); // refresh sidebar history
  }, []);

  const handleThreadId = useCallback((threadId) => {
    setActiveThreadId(threadId);
    // Trigger auto title generation for new thread after short delay
    if (firstMessageRef.current) {
      setTimeout(async () => {
        try {
          await fetch(`${API_BASE}/threads/${threadId}/generate-title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_message: firstMessageRef.current }),
          });
          firstMessageRef.current = null;
          fetchThreads(); // refresh sidebar with new title
        } catch (e) {
          console.warn('Title generation failed:', e);
        }
      }, 500);
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error('WS Error:', err);
    setIsStreaming(false);
    setStreamingContent('');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `⚠️ Error: ${err}. Please check your connection and try again.`
    }]);
  }, []);

  const { sendMessage, isConnected } = useWebSocket({
    onChunk: handleChunk,
    onDone: handleDone,
    onThreadId: handleThreadId,
    onError: handleError,
  });

  // Poll connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnected(isConnected());
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // ---- Fetch threads from REST API ----
  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/threads/`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (e) {
      console.warn('Could not fetch threads:', e);
    }
  }, []);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // ---- Load a thread's messages ----
  const loadThread = useCallback(async (threadId) => {
    try {
      const res = await fetch(`${API_BASE}/threads/${threadId}`);
      const data = await res.json();
      setActiveThreadId(threadId);
      setMessages(data.messages || []);
      setStreamingContent('');
      setIsStreaming(false);
    } catch (e) {
      console.warn('Could not load thread:', e);
    }
  }, []);

  // ---- New chat ----
  const handleNewChat = useCallback(() => {
    setActiveThreadId(null);
    setMessages([]);
    setStreamingContent('');
    setIsStreaming(false);
  }, []);

  // ---- Send a message ----
  const handleSend = useCallback((text) => {
    // Store first message for auto-title generation on new threads
    if (!activeThreadId) {
      firstMessageRef.current = text;
    }
    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setStreamingContent('');
    setIsStreaming(true);
    sendMessage(text, tone, activeThreadId);
  }, [sendMessage, tone, activeThreadId]);

  return (
    <div className="app-layout">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        tone={tone}
        onSelectThread={loadThread}
        onNewChat={handleNewChat}
        onToneChange={setTone}
      />
      <ChatWindow
        messages={messages}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
        tone={tone}
        onSend={handleSend}
        isConnected={connected}
      />
    </div>
  );
}
