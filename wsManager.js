// Centralized WebSocket manager with auto-reconnect & auth
import { API_BASE_URL } from './config';
import { addMessage } from './messageStore';
import { TokenStorage } from './tokenStorage';

class WSManager {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.openWaiters = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 20000; // 20s
    this.baseDelay = 1000; // 1s
    this.heartbeatInterval = null;
    this.heartbeatMs = 25000;
    this.manualClose = false;
  }

  get status() {
    if (!this.ws) return 'DISCONNECTED';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }

  onStatus(fn) { this.statusListeners.add(fn); return () => this.statusListeners.delete(fn); }
  onMessage(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emitStatus() { for (const fn of this.statusListeners) fn(this.status); }

  async connect(force = false) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) && !force) {
      return; // Already connected or in progress
    }
    const token = await TokenStorage.getToken();
    if (!token) {
      console.log('[WS] No token present – skipping connect');
      return;
    }
    const wsUrl = this._buildWsUrl();
    this.manualClose = false;

    try {
      this.ws?.close();
    } catch {}

    console.log('[WS] Connecting to', wsUrl);
    this.ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);
    this.emitStatus();

    this.ws.onopen = () => {
      console.log('🔌 WebSocket OPEN');
      this.reconnectAttempts = 0;
      this.emitStatus();
      this._startHeartbeat();
      // Resolve any pending ensureConnected waiters
      for (const { resolve } of this.openWaiters) {
        try { resolve(); } catch {}
      }
      this.openWaiters.clear();
    };

    this.ws.onmessage = (e) => {
      // Optionally parse JSON
      let payload = e.data;
      // Payload have {group_id, groud_name, sender_id, sender_username, message, created_ay }
      console.log('📩 WS message', payload);
      try { payload = JSON.parse(e.data); } catch {}
      for (const fn of this.listeners) fn(payload);
    };

    this.ws.onerror = (err) => {
      console.warn('⚠ WS error', err.message || err);
    };

    this.ws.onclose = (e) => {
      console.log('❌ WS closed', e.code, e.reason);
      this.emitStatus();
      this._stopHeartbeat();
      // Reject pending waiters
      if (this.openWaiters.size) {
        for (const { reject } of this.openWaiters) {
          try { reject(new Error('WebSocket closed before opening')); } catch {}
        }
        this.openWaiters.clear();
      }
      if (!this.manualClose) this._scheduleReconnect();
    };
  }

  _buildWsUrl() {
    // Convert http(s)://host:port to ws(s)://host:port
    if (API_BASE_URL.startsWith('https://')) return API_BASE_URL.replace('https://', 'wss://') + '/api/messages/ws';
    if (API_BASE_URL.startsWith('http://')) return API_BASE_URL.replace('http://', 'ws://') + '/api/messages/ws';
    return 'ws://' + API_BASE_URL + '/api/messages/ws';
  }

  _scheduleReconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(this.baseDelay * 2 ** (this.reconnectAttempts - 1), this.maxReconnectDelay);
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() })); } catch {}
      }
    }, this.heartbeatMs);
  }

  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const data = typeof obj === 'string' ? obj : JSON.stringify(obj);
      this.ws.send(data);
      return true;
    }
    console.warn('[WS] Cannot send – socket not open');
    return false;
  }

  close() {
    this.manualClose = true;
    this._stopHeartbeat();
    try { this.ws?.close(); } catch {}
  }

  /**
   * Ensure the socket is OPEN. Returns a promise that resolves when open or
   * rejects after timeout. Will trigger a connect() if not already connecting.
   * @param {number} timeoutMs - how long to wait before rejecting (default 5000)
   */
  async ensureConnected(timeoutMs = 5000) {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    // Trigger a connect attempt if needed
    this.connect();
    return new Promise((resolve, reject) => {
      const entry = { resolve, reject };
      this.openWaiters.add(entry);
      const timer = setTimeout(() => {
        if (this.openWaiters.has(entry)) {
          this.openWaiters.delete(entry);
          reject(new Error('WebSocket connect timeout'));
        }
      }, timeoutMs);
      // If it opens earlier the onopen handler will resolve.
      // Cleanup timer on resolve/reject
      const origResolve = resolve;
      const origReject = reject;
      entry.resolve = () => { clearTimeout(timer); origResolve(); };
      entry.reject = (err) => { clearTimeout(timer); origReject(err); };
    });
  }
}

export const wsManager = new WSManager();

// Convenience helpers
export function subscribeMessages(handler) {
  return wsManager.onMessage(handler);
}

export function sendMessage(payload) {
  return wsManager.send(payload);
}

// Promise helper for components wanting to await connection
export function ensureWsConnected(timeoutMs) {
  return wsManager.ensureConnected(timeoutMs);
}

// Bridge incoming WS messages to local messageStore (placeholder parsing)
wsManager.onMessage((payload) => {
  // Expecting either { type: 'group_message', group: 'Group Name', text, sender, ts }
  // or a raw string; adapt as backend evolves.
  try {
    if (payload && typeof payload === 'object') {
      if (payload.type === 'group_message' && payload.group && payload.text) {
        addMessage(payload.group, {
          text: payload.text,
          sender: payload.sender || 'Remote',
          isCurrentUser: false,
          timestamp: payload.ts ? new Date(payload.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined
        });
      }
    }
  } catch (e) {
    console.log('WS message bridge error', e.message);
  }
});
