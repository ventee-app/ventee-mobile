import React, { memo, useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

import styles from './styles';

function ReceiveContacts(): React.ReactElement {
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);

  const handleCancelScanning = (): void => setScanning(false);

  const handleScanningResult = (result: BarCodeScannerResult): void => {
    setScanned(true);
    setScanning(false);

    const { data } = result;

    // TODO: request contacts
    return Alert.alert(
      'Scan complete',
      `Scanned ID: ${data}`,
    );
  };

  const handleStartScanning = async (): Promise<void> => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert(
        'Camera access denied!',
        'Could not scan the code!',
      );
    }
    return setScanning(true);
  };

  return (
    <View style={styles.container}>
      { !scanned && !scanning && (
        <Pressable
          onPress={handleStartScanning}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Scan code
          </Text>
        </Pressable>
      ) }
      { !scanned && scanning && (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleScanningResult}
            style={{
              width: '100%',
              height: '80%',
            }}
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
      ) }
    </View>
  );
}

export default memo(ReceiveContacts);
