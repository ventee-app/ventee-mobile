import BACKEND_URL_STRING from './backend-url';

export const BACKEND_URL = BACKEND_URL_STRING;

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
