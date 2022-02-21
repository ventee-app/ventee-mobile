import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import QR from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { BACKEND_URL, EVENTS } from '../../constants';
import Contact from './components/Contact';
import { WebsocketMessageData } from '../../types/data-models';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#aabbff',
    color: 'black',
    margin: 16,
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

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

export default function TabOneScreen(): React.ReactElement {
  const [connectionId, setConnectionId] = useState<string>('');
  const [contactsData, setContactsData] = useState<ExtendedContact[]>([]);
  const [dataForTransfer, setDataForTransfer] = useState<string>('');
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

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
      WSC.onopen = (): void => {
        console.log('opened connection');
      };
      WSC.onclose = (reason): void => {
        console.log('closed connection', reason);
      };
      WSC.onmessage = (
        message: MessageEvent<string>,
      ): void => {
        console.log('received message', message.data);
        try {
          const parsed: WebsocketMessageData<RegisterConnectionData> = JSON.parse(message.data);
          if (parsed.event === EVENTS.registerConnection && parsed.data) {
            return setConnectionId(parsed.data.connectionId);
          }
          return console.log('parsed', parsed);
        } catch {
          return console.log('could not parse');
        }
      };
    },
    [],
  );

  // const handlePress = async () => {
  //   if (Platform.OS === 'ios') {
  //     const id = await Contacts.addContactAsync(
  //       {
  //         contactType: 'person',
  //         phoneNumbers: [
  //           {
  //             label: 'work',
  //             id: '516',
  //             isPrimary: false,
  //             number: '',
  //           },
  //         ],
  //         firstName: '',
  //         name: '',
  //         id: '197',
  //         imageAvailable: false,
  //       },
  //     );
  //     console.log('ID:', id);
  //   }
  // };

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

  const handleGenerateQR = (): void => setDataForTransfer(JSON.stringify({
    data: contactsData.filter((item: ExtendedContact): boolean => item.isChecked),
    event: EVENTS.transferContacts,
  }));

  const handleScanQR = (): void => setIsScanning(true);

  const handleScanResult = (result: any): void => {
    console.log(result);
    setIsScanning(false);
    setIsScanned(true);
  };

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
          renderItem={renderItem}
          keyExtractor={(item: ExtendedContact): string => item.id}
        />
      ) }
      { contactsData.length > 0 && !!connectionId && (
        <Pressable
          onPress={handleGenerateQR}
          style={styles.button}
        >
          <Text>
            Transfer contacts
          </Text>
        </Pressable>
      ) }
      { !!dataForTransfer && (
        <QR value={connectionId} size={200} />
      ) }
      { !!connectionId && (
        <Pressable
          onPress={handleScanQR}
          style={styles.button}
        >
          <Text>
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
