import React, { memo } from 'react';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

import BigButton from '../../../components/BigButton';
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
      <BigButton
        handlePress={handleCancelScanning}
        text="Cancel"
      />
    </>
  );
}

export default memo(Scanner);
