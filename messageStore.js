// Simple in-memory message & group store (no persistence yet)
// Provides subscription APIs so UI updates when messages change.

const listeners = new Set(); // general change listeners

// Data shape:
// groups: {
//   [groupName]: {
//     id: string,
//     name: string,
//     messages: [ { id, text, sender, timestamp, isCurrentUser } ],
//     unreadCount: number,
//     lastMessage: string,
//     lastTimestamp: string
//   }
// }

const groups = {};
let nextMessageId = 1;

function emit() {
  for (const fn of listeners) fn();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function seedGroups(initialList) {
  let changed = false;
  initialList.forEach(g => {
    if (!g || !g.name) return;
    if (!groups[g.name]) {
      const msgs = Array.isArray(g.messages) ? g.messages.map(m => ({
        id: m.id || String(nextMessageId++),
        text: m.text || '',
        sender: m.sender || 'Unknown',
        isCurrentUser: !!m.isCurrentUser,
        timestamp: m.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      })) : [];
      const last = msgs[msgs.length - 1];
      groups[g.name] = {
        id: g.id || g.name,
        name: g.name,
        messages: msgs,
        unreadCount: g.unreadCount != null ? g.unreadCount : (g.messagesUnread || 0),
        lastMessage: g.lastMessage || (last ? last.text : ''),
        lastTimestamp: g.timestamp || (last ? last.timestamp : '')
      };
      changed = true;
    }
  });
  if (changed) emit();
}

export function addMessage(groupName, { text, sender = 'Unknown', isCurrentUser = false, timestamp }) {
  const g = groups[groupName] || (groups[groupName] = { id: groupName, name: groupName, messages: [], unreadCount: 0, lastMessage: '', lastTimestamp: '' });
  const msg = {
    id: String(nextMessageId++),
    text,
    sender,
    isCurrentUser,
    timestamp: timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  g.messages.push(msg);
  g.lastMessage = text;
  g.lastTimestamp = msg.timestamp;
  if (!isCurrentUser) g.unreadCount += 1;
  emit();
  return msg;
}

export function markGroupRead(groupName) {
  const g = groups[groupName];
  if (g) {
    g.unreadCount = 0;
    emit();
  }
}

export function getGroupMessages(groupName) {
  return groups[groupName]?.messages || [];
}

export function getGroupsArray() {
  // Convert to array sorted by most recent activity
  return Object.values(groups).sort((a, b) => {
    const ta = a.lastTimestamp || ''; const tb = b.lastTimestamp || '';
    return tb.localeCompare(ta);
  });
}

export function ensureSeeded() {
  if (Object.keys(groups).length === 0) return false;
  return true;
}
