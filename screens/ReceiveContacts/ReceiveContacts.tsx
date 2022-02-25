import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
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
import useWebsockets from '../../hooks/use-websockets';

interface TransferContactsData {
  contacts: Contacts.Contact[];
}

function ReceiveContacts(): React.ReactElement {
  const {
    store: {
      connection,
      connectionId,
    } = {},
    dispatch,
  } = useContext<ContextStorage>(context);
  useWebsockets({ connection, dispatch });

  const [loadedContacts, setLoadedContacts] = useState<ExtendedContact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);

  const handleMessage = async (message: MessageEvent<string>): Promise<void> => {
    const parsed: WebsocketMessageData = JSON.parse(message.data);

    if (parsed.event === EVENTS.transferContacts
      && parsed.data && parsed.issuer
      && parsed.target === connectionId) {
      const payload: TransferContactsData = JSON.parse(parsed.data);
      setLoadedContacts(payload.contacts.map((item: Contacts.Contact): ExtendedContact => ({
        ...item,
        isChecked: true,
      })));

      if (connection && connectionId) {
        connection.send(JSON.stringify({
          event: EVENTS.transferComplete,
          issuer: connectionId,
          target: parsed.issuer,
        }));
      }

      setLoading(false);
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

  const handleScanningResult = useCallback(
    (result: BarCodeScannerResult): void => {
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
    },
    [
      connection,
      connectionId,
    ],
  );

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
      { loading && (
        <Text>
          Loading...
        </Text>
      ) }
      { !loading && !scanned && !scanning && (
        <Pressable
          onPress={handleStartScanning}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Scan code
          </Text>
        </Pressable>
      ) }
      { !loading && !scanned && scanning && (
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
      ) }
      { !loading && scanned && !scanning && loadedContacts.length > 0 && (
        <View>
          <Text>
            { `Total: ${loadedContacts.length} contacts received` }
          </Text>
        </View>
      ) }
    </View>
  );
}

export default memo(ReceiveContacts);
