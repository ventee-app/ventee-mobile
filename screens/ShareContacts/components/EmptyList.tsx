import React, { memo } from 'react';
import { Text, View } from 'react-native';

import styles from '../styles';

function EmptyList(): React.ReactElement {
  return (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyList}>
        No contacts found!
      </Text>
    </View>
  );
}

export default memo(EmptyList);
