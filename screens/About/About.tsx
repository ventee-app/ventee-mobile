import React, { memo } from 'react';
import {
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';

import styles from './styles';

function About() {
  const handleLink = (link: string): Promise<void> => Linking.openURL(link);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Ventee
      </Text>
      <Text style={styles.description}>
        By peterdee, 2022
      </Text>
      <Text style={styles.description}>
        More stuff:
      </Text>
      <Pressable
        onPress={() => handleLink('https://peterdee.github.com')}
        style={styles.linkWrap}
      >
        <Text style={styles.linkText}>
          https://peterdee.github.com
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleLink('https://dyum.in')}
        style={styles.linkWrap}
      >
        <Text style={styles.linkText}>
          https://dyum.in
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(About);
