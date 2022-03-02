import React, { memo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { COLORS, SPACER } from '../../constants';
import styles from './styles';

interface ActionCompleteProps {
  actionText: string;
  handleClose: () => void;
}

function ActionComplete(props: ActionCompleteProps): React.ReactElement {
  const {
    actionText,
    handleClose,
  } = props;

  return (
    <View style={styles.container}>
      <FontAwesome
        color={COLORS.accent}
        name="check"
        size={SPACER * 10}
      />
      <Text style={styles.actionCompleteText}>
        { actionText }
      </Text>
      <Pressable
        onPress={handleClose}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>
          Close
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(ActionComplete);
