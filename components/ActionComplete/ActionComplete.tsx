import React, { memo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import BigButton from '../BigButton';
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
      <BigButton
        buttonStyles={styles.closeButton}
        handlePress={handleClose}
        text="Close"
      />
    </View>
  );
}

export default memo(ActionComplete);
