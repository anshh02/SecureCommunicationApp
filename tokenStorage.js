import * as SecureStore from 'expo-secure-store';

// Adaptive token storage: uses SecureStore on native (Expo/React Native) and
// falls back to window.localStorage when running in a browser/WEB environment.
// Public API remains: setToken, getToken, deleteToken, getUserData, isAuthenticated

const TOKEN_KEY = 'sc_access_token';
const USER_KEY = 'sc_user';

// Environment detection (safe for SSR / native)
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof localStorage !== 'undefined';

// Internal helpers for browser localStorage usage
const browserStore = {
  async setItem(key, value) { localStorage.setItem(key, value); },
  async getItem(key) { return localStorage.getItem(key); },
  async deleteItem(key) { localStorage.removeItem(key); },
};

// Resolve the correct storage interface for token & user
function storage() {
  return isBrowser ? browserStore : SecureStore;
}

async function setToken(token, userData = undefined) {
  try {
    const store = storage();
    if (token) {
      if (isBrowser) await store.setItem(TOKEN_KEY, token); else await store.setItemAsync(TOKEN_KEY, token);
    }
    if (userData !== undefined) {
      const serialized = JSON.stringify(userData);
      if (isBrowser) await store.setItem(USER_KEY, serialized); else await store.setItemAsync(USER_KEY, serialized);
    }
    return true;
  } catch (e) {
    console.warn('setToken error', e);
    return false;
  }
}

async function getToken() {
  try {
    const store = storage();
    return isBrowser ? await store.getItem(TOKEN_KEY) : await store.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.warn('getToken error', e);
    return null;
  }
}

async function deleteToken() {
  try {
    const store = storage();
    if (isBrowser) {
      await store.deleteItem(TOKEN_KEY);
      await store.deleteItem(USER_KEY);
    } else {
      await store.deleteItemAsync(TOKEN_KEY);
      await store.deleteItemAsync(USER_KEY);
    }
    return true;
  } catch (e) {
    console.warn('deleteToken error', e);
    return false;
  }
}

async function getUserData() {
  try {
    const store = storage();
    const raw = isBrowser ? await store.getItem(USER_KEY) : await store.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('getUserData error', e);
    return null;
  }
}

async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export const TokenStorage = {
  setToken,
  getToken,
  deleteToken,
  getUserData,
  isAuthenticated,
};

export default TokenStorage;