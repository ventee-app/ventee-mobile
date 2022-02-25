import React, { memo } from 'react';
import { View } from 'react-native';

import Ring from './components/Ring';
import styles from './styles';

function Spinner() {
  return (
    <View style={styles.container}>
      <Ring delay={0} />
      <Ring delay={750} />
      <Ring delay={1500} />
      <Ring delay={2250} />
    </View>
  );
}

export default memo(Spinner);
