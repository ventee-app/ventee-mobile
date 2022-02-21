export const BACKEND_URL = 'ws://localhost:9099';

export const EVENTS = {
  registerConnection: 'register-connection',
  requestContacts: 'request-contacts',
  transferComplete: 'transfer-complete',
  transferContacts: 'transfer-contacts',
} as const;
