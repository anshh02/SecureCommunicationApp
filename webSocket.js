import { useEffect, useRef } from 'react';

export function useWebSocket(url, token, active) {
  const ws = useRef(null);

  useEffect(() => {
    if (!active || !token) return;

    ws.current = new WebSocket(`${url}?token=${token}`);

    ws.current.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      console.log('📩 Message:', event.data);
    };

    ws.current.onclose = () => {
      console.log('❌ WebSocket closed');
    };

    ws.current.onerror = (error) => {
      console.error('⚠ WebSocket error:', error.message);
    };

    return () => {
      ws.current?.close();
    };
  }, [url, token, active]);

  return ws;
}