import React, { memo, useMemo, useReducer } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Navigation from './navigation';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Context, { ContextStorage, initialState, reducer } from './store';

function App(): React.ReactElement | null {
  const colorScheme = useColorScheme(); // TODO: remove
  const isLoadingComplete = useCachedResources();

  const [state, dispatch] = useReducer(reducer, initialState);
  const memoized = useMemo<ContextStorage>(
    () => ({ dispatch, store: state }),
    [dispatch, state],
  );

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Context.Provider value={memoized}>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </Context.Provider>
    </SafeAreaProvider>
  );
}

export default memo(App);
