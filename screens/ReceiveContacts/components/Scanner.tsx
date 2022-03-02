import React, { memo } from 'react';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Pressable, Text } from 'react-native';

import styles from '../styles';

interface ScannerProps {
  handleCancelScanning: () => void;
  handleScanningResult: (value: BarCodeScannerResult) => void;
  scanned: boolean;
}

function Scanner(props: ScannerProps): React.ReactElement {
  const {
    handleCancelScanning,
    handleScanningResult,
    scanned,
  } = props;

  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScanningResult}
        style={styles.scanner}
      />
      <Pressable
        onPress={handleCancelScanning}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Cancel
        </Text>
      </Pressable>
    </>
  );
}

export default memo(Scanner);
