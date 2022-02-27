import React, { memo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import styles from '../styles';
import { COLORS, SPACER } from '../../../constants';

interface TransferCompleteProps {
  handleClose: () => void;
}

function TransferComplete(props: TransferCompleteProps): React.ReactElement {
  const {
    handleClose,
  } = props;

  return (
    <View style={styles.emptyListContainer}>
      <FontAwesome
        name="check"
        size={SPACER * 10}
        color={COLORS.accent}
      />
      <Text style={styles.contactsTransferredText}>
        Contacts transferred!
      </Text>
      <Pressable
        onPress={handleClose}
        style={styles.closeQRCodeButton}
      >
        <Text style={styles.generateQRButtonText}>
          Close
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(TransferComplete);
