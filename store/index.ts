import React, { createContext } from 'react';

import { Action, Store } from '../types/data-models';
import * as actions from './actions';

export const initialState: Store = {
  connection: null,
  connectionId: '',
};

export const reducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case actions.STORE_CONNECTION: {
      return {
        ...state,
        connection: action.payload,
      };
    }
    case actions.STORE_CONNECTION_ID: {
      return {
        ...state,
        connectionId: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export interface ContextStorage {
  dispatch: React.Dispatch<Action>;
  store: Store;
}

export default createContext<ContextStorage>({} as ContextStorage);
