import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import QR from 'react-native-qrcode-svg';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

import { BACKEND_URL, EVENTS } from '../../constants';
import Contact from './components/Contact';
import { WebsocketMessageData } from '../../types/data-models';
import styles from './styles';

/**
 * Get stored contacts
 * @returns {Promise<null | Contacts.ContactResponse>}
 */
async function getContacts(): Promise<null | Contacts.ContactResponse> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }
  return Contacts.getContactsAsync();
}

interface ExtendedContact extends Contacts.Contact {
  isChecked: boolean;
}

interface RegisterConnectionData {
  connectionId: string;
}

function ShareContacts(): React.ReactElement {
  const [connectionId, setConnectionId] = useState<string>('');
  const [contactsData, setContactsData] = useState<ExtendedContact[]>([]);
  const [dataForTransfer, setDataForTransfer] = useState<ExtendedContact[]>([]);
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [connection, setConnection] = useState<null | WebSocket>(null);

  useEffect(
    (): void => {
      getContacts().then((result: null | Contacts.ContactResponse): void => {
        if (result) {
          const { data } = result;
          setContactsData(data.map((item: Contacts.Contact): ExtendedContact => ({
            ...item,
            isChecked: true,
          })));
        }
      }).catch((error) => {
        console.log(error);
      });
      const WSC = new WebSocket(BACKEND_URL);
      WSC.onopen = (): void => setConnection(WSC);
      WSC.onclose = (): void => setConnection(null);
      WSC.onmessage = (
        message: MessageEvent<string>,
      ): Promise<any[]> | void => {
        try {
          const parsed: WebsocketMessageData = JSON.parse(message.data);

          if (parsed.event === EVENTS.registerConnection && parsed.data) {
            const payload: RegisterConnectionData = JSON.parse(parsed?.data);
            console.log(`${Platform.OS}`, 'registered as', payload.connectionId);
            return setConnectionId(payload.connectionId);
          }

          if (parsed.event === EVENTS.requestContacts
            && parsed.issuer && parsed.target) {
            console.log(`${Platform.OS}`, 'requested contacts to', parsed.issuer);
            return WSC.send(JSON.stringify({
              data: JSON.stringify({
                contacts: dataForTransfer,
              }),
              event: EVENTS.transferContacts,
              issuer: connectionId,
              target: parsed.issuer,
            }));
          }

          if (parsed.event === EVENTS.transferContacts
            && parsed.data
            && parsed.issuer
            && parsed.target) {
            console.log(`${Platform.OS}`, 'transfered contacts from', parsed.issuer);
            const payload = JSON.parse(parsed.data);
            const promises = payload?.contacts.map(
              (contact: Contacts.Contact) => Contacts.addContactAsync(contact),
            );
            return Promise.all(promises);
          }

          return console.log('did not handle the event', parsed, Platform.OS);
        } catch (error) {
          return console.log('ERROR: could not parse', error);
        }
      };
    },
    [],
  );

  const handleCheckBox = (id: string): void => {
    setContactsData(
      (state: ExtendedContact[]): ExtendedContact[] => state.map(
        (item: ExtendedContact): ExtendedContact => ({
          ...item,
          isChecked: item.id === id ? !item.isChecked : item.isChecked,
        }),
      ),
    );
  };

  const handleGenerateQR = (): void => setDataForTransfer(
    contactsData.filter((item: ExtendedContact): boolean => item.isChecked),
  );

  const handleScanQR = async (): Promise<void> => {
    await BarCodeScanner.requestPermissionsAsync();
    setIsScanning(true);
  };

  const handleScanResult = useCallback(
    (result: BarCodeScannerResult): null | void => {
      if (!connection) {
        return null;
      }
      connection.send(JSON.stringify({
        event: EVENTS.requestContacts,
        issuer: connectionId,
        target: result.data,
      }));
      setIsScanning(false);
      setIsScanned(true);
      return setLoading(true);
    },
    [connectionId],
  );

  const renderItem = ({ item }: any): React.ReactElement => (
    <Contact
      handleCheckBox={handleCheckBox}
      id={item.id}
      isChecked={item.isChecked}
      name={item.name}
    />
  );

  return (
    <View style={styles.container}>
      { contactsData.length > 0 && (
        <FlatList
          data={contactsData}
          keyExtractor={(item: ExtendedContact): string => item.id}
          renderItem={renderItem}
          style={{
            maxWidth: '100%',
          }}
        />
      ) }
      { contactsData.length > 0 && !!connectionId && (
        <Pressable
          onPress={handleGenerateQR}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Transfer contacts
          </Text>
        </Pressable>
      ) }
      { dataForTransfer.length > 0 && (
        <QR value={connectionId} size={200} />
      ) }
      { !!connectionId && (
        <Pressable
          onPress={handleScanQR}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Scan the code
          </Text>
        </Pressable>
      ) }
      { !isScanned && isScanning && (
        <BarCodeScanner
          onBarCodeScanned={isScanned ? undefined : handleScanResult}
          style={StyleSheet.absoluteFillObject}
        />
      ) }
    </View>
  );
}

export default memo(ShareContacts);
