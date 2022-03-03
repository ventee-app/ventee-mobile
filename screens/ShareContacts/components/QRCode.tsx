import React, { memo } from 'react';
import QR from 'react-native-qrcode-svg';
import {
  Dimensions,
  Text,
  View,
} from 'react-native';

import BigButton from '../../../components/BigButton';
import styles from '../styles';

interface QRCodeProps {
  handleCloseQR: () => void;
  transferAmount: number;
  value: string;
}

function QRCode(props: QRCodeProps): React.ReactElement {
  const {
    handleCloseQR,
    transferAmount,
    value,
  } = props;

  return (
    <View style={styles.emptyListContainer}>
      <Text style={styles.transferAmountText}>
        { `Contacts to transfer: ${transferAmount}` }
      </Text>
      <QR
        size={Math.floor(Dimensions.get('screen').width * 0.8)}
        value={value}
      />
      <BigButton
        buttonStyles={styles.closeQRCodeButton}
        handlePress={handleCloseQR}
        text="Cancel"
      />
    </View>
  );
}

export default memo(QRCode);
