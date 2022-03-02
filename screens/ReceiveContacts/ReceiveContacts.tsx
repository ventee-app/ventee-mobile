import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import * as Contacts from 'expo-contacts';

import context, { ContextStorage } from '../../store';
import { EVENTS } from '../../constants';
import { ExtendedContact, WebsocketMessageData } from '../../types/data-models';
import Spinner from '../../components/Spinner';
import styles from './styles';
import useWebsockets from '../../hooks/use-websockets';
import ContactsList from '../../components/ContactsList';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [transferComplete, setTransferComplete] = useState<boolean>(false);

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
        setLoading(false);
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

  const handleCancelSaving = (): void => {
    setLoadedContacts([]);
    setLoading(false);
    setScanned(false);
    setScanning(false);
    setSearch('');
    return setTransferComplete(false);
  };

  const handleCancelScanning = (): void => setScanning(false);

  const handleCheckAll = (): void => setLoadedContacts(
    (state: ExtendedContact[]): ExtendedContact[] => state.map(
      (item: ExtendedContact): ExtendedContact => ({
        ...item,
        isChecked: true,
      }),
    ),
  );

  const handleCheckBox = (id: string): void => setLoadedContacts(
    (state: ExtendedContact[]): ExtendedContact[] => state.map(
      (item: ExtendedContact): ExtendedContact => ({
        ...item,
        isChecked: item.id === id ? !item.isChecked : item.isChecked,
      }),
    ),
  );

  const handleClearSearch = (): void => {
    Keyboard.dismiss();
    return setSearch('');
  };

  const handleSaveContacts = useCallback(
    (): void => {
      setTransferComplete(true);
    },
    [loadedContacts],
  );

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

  const handleUncheckAll = (): void => setLoadedContacts(
    (state: ExtendedContact[]): ExtendedContact[] => state.map(
      (item: ExtendedContact): ExtendedContact => ({
        ...item,
        isChecked: false,
      }),
    ),
  );

  return (
    <View style={styles.container}>
      { loading && (
        <Spinner />
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
        <ContactsList
          actionButtonText="Save"
          contacts={loadedContacts}
          handleActionButton={handleSaveContacts}
          handleCancel={handleCancelSaving}
          handleCheckAll={handleCheckAll}
          handleCheckBox={handleCheckBox}
          handleClearSearch={handleClearSearch}
          handleUncheckAll={handleUncheckAll}
          searchValue={search}
          setSearch={setSearch}
          type="receive"
        />
      ) }
    </View>
  );
}

export default memo(ReceiveContacts);
