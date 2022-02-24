import { Contact } from 'expo-contacts';

import * as actions from '../store/actions';

export interface Action {
  payload?: any;
  type: keyof typeof actions;
}

export interface ExtendedContact extends Contact {
  isChecked: boolean;
}

export interface Store {
  connection: WebSocket | null;
  connectionId: string;
}

export interface WebsocketMessageData {
  data?: string;
  event: string;
  issuer: string;
  target: string;
}
