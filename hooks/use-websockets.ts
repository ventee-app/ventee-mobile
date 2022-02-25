import React, { useEffect } from 'react';
import { BACKEND_URL, EVENTS } from '../constants';

import {
  Action,
  RegisterConnectionData,
  WebsocketMessageData,
} from '../types/data-models';
import * as actions from '../store/actions';

interface UseWebsocketsParams {
  connection: WebSocket | null | undefined;
  dispatch: React.Dispatch<Action>;
}

function useWebsockets(params: UseWebsocketsParams): void {
  const {
    connection,
    dispatch,
  } = params;

  useEffect(
    (): void => {
      if (!connection) {
        const newConnection = new WebSocket(BACKEND_URL);
        newConnection.onmessage = (message: MessageEvent<string>): void => {
          const parsed: WebsocketMessageData = JSON.parse(message.data);
          if (parsed && parsed.event === EVENTS.registerConnection && parsed.data) {
            const payload: RegisterConnectionData = JSON.parse(parsed.data);
            dispatch({
              payload: payload.connectionId,
              type: actions.STORE_CONNECTION_ID,
            });
          }
        };
        dispatch({
          payload: newConnection,
          type: actions.STORE_CONNECTION,
        });
      }
    },
    [connection, dispatch],
  );
}

export default useWebsockets;
