import React, { memo, useMemo, useReducer } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Context, {
  ContextStorage,
  initialState,
  reducer,
} from './store';
import Navigation from './navigation';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

function App(): React.ReactElement | null {
  const colorScheme = useColorScheme();
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
