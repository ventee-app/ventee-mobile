// export const BACKEND_URL = 'ws://localhost:9099';
export const BACKEND_URL = 'ws://localhost:9099';

export const COLORS = {
  accent: '#6600FF',
  background: '#FFFFFF',
  text: '#282828',
  textInverted: '#FFFFFF',
  textMuted: '#989898',
} as const;

export const EVENTS = {
  registerConnection: 'register-connection',
  requestContacts: 'request-contacts',
  transferComplete: 'transfer-complete',
  transferContacts: 'transfer-contacts',
} as const;

export const SPACER = 16;
