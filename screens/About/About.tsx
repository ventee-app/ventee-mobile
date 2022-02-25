import React, { memo } from 'react';
import {
  Platform,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import styles from './styles';

function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

export default memo(About);
