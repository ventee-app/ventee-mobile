import React, { memo, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import styles from '../styles';

interface RingProps {
  delay: number;
}

function Ring(props: RingProps): React.ReactElement {
  const { delay } = props;

  const ring = useSharedValue(0);
  const ringStyle = useAnimatedStyle(
    () => ({
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    }),
  );

  useEffect(
    () => {
      ring.value = withDelay(
        delay,
        withRepeat(
          withTiming(
            1,
            {
              duration: 3000,
            },
          ),
          -1,
          false,
        ),
      );
    },
    [],
  );

  return (
    <Animated.View style={[styles.ring, ringStyle]} />
  );
}

export default memo(Ring);
