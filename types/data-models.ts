export interface WebsocketMessageData {
  data?: string;
  event: string;
  issuer: string;
  target: string;
}
