export interface WebsocketMessageData<D = void> {
  data?: D;
  event: string;
}
