import { useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws/chat';

export function useWebSocket({ onChunk, onDone, onThreadId, onError }) {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'thread_id': onThreadId?.(data.thread_id); break;
          case 'chunk':     onChunk?.(data.content);    break;
          case 'done':      onDone?.(data.content);     break;
          case 'error':     onError?.(data.content);    break;
        }
      } catch (e) {
        onError?.('Failed to parse server message');
      }
    };

    ws.onerror = () => onError?.('WebSocket connection error');

    ws.onclose = () => {
      // Auto-reconnect after 2s
      reconnectTimer.current = setTimeout(connect, 2000);
    };
  }, [onChunk, onDone, onThreadId, onError]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message, tone, threadId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        message,
        tone,
        thread_id: threadId || null,
      }));
      return true;
    }
    onError?.('Not connected to server');
    return false;
  }, [onError]);

  const isConnected = () => wsRef.current?.readyState === WebSocket.OPEN;

  return { sendMessage, isConnected };
}
