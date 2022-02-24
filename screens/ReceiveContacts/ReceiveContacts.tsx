import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import * as Contacts from 'expo-contacts';

import context, { ContextStorage } from '../../store';
import { EVENTS } from '../../constants';
import { ExtendedContact, WebsocketMessageData } from '../../types/data-models';
import styles from './styles';

interface TransferContactsData {
  contacts: Contacts.Contact[];
}

function ReceiveContacts(): React.ReactElement {
  const { store: { connection, connectionId } = {} } = useContext<ContextStorage>(context);

  const [loadedContacts, setLoadedContacts] = useState<ExtendedContact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);

  const handleMessage = async (message: MessageEvent<string>): Promise<void> => {
    const parsed: WebsocketMessageData = JSON.parse(message.data);

    if (parsed.event === EVENTS.transferContacts
      && parsed.data && parsed.issuer
      && parsed.target === connectionId) {
      console.log(`${Platform.OS}`, 'transferred contacts from', parsed.issuer);
      const payload: TransferContactsData = JSON.parse(parsed.data);
      setLoadedContacts(payload.contacts.map((item: Contacts.Contact): ExtendedContact => ({
        ...item,
        isChecked: true,
      })));
    }
  };

  useEffect(
    (): (() => void) => {
      if (connection && connectionId) {
        connection.addEventListener('message', handleMessage);
      }
      return (): void => {
        if (connection && connectionId) {
          connection.removeEventListener('message', handleMessage);
        }
      };
    },
    [
      connection,
      connectionId,
    ],
  );

  const handleCancelScanning = (): void => setScanning(false);

  const handleScanningResult = (result: BarCodeScannerResult): void => {
    setScanned(true);
    setScanning(false);

    const { data } = result;

    if (!(connection && connectionId)) {
      return Alert.alert(
        'Server connection failed!',
        'Could not connect to the server!',
      );
    }

    setLoading(true);
    return connection.send(JSON.stringify({
      event: EVENTS.requestContacts,
      issuer: connectionId,
      target: data,
    }));
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
