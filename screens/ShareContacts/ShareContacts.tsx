import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import QR from 'react-native-qrcode-svg';

import Contact from './components/Contact';
import context, { ContextStorage } from '../../store';
import { EVENTS } from '../../constants';
import { ExtendedContact, WebsocketMessageData } from '../../types/data-models';
import styles from './styles';
import useWebsockets from '../../hooks/use-websockets';

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

function ShareContacts(): React.ReactElement {
  const {
    store: {
      connection,
      connectionId,
    } = {},
    dispatch,
  } = useContext<ContextStorage>(context);
  useWebsockets({ connection, dispatch });

  const [contactsData, setContactsData] = useState<ExtendedContact[]>([]);
  const [dataForTransfer, setDataForTransfer] = useState<ExtendedContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(
    (): void => {
      getContacts().then((result: null | Contacts.ContactResponse): void => {
        if (!result) {
          return Alert.alert(
            'Contacts access denied!',
            'Please provide access to the contacts!',
          );
        }
        const { data } = result;
        return setContactsData(
          data.map((item: Contacts.Contact): ExtendedContact => ({
            ...item,
            isChecked: true,
          })),
        );
      }).catch((): void => {
        Alert.alert(
          'Contacts request failed',
          'Failed to load the contacts!',
        );
      }).finally(() => {
        setLoading(false);
      });
    },
    [],
  );

  useEffect(
    (): void => {
      if (connection && connectionId) {
        connection.onmessage = (
          message: MessageEvent<string>,
        ): void => {
          const parsed: WebsocketMessageData = JSON.parse(message.data);

          if (parsed.event === EVENTS.requestContacts
            && parsed.issuer && parsed.target) {
            setLoading(true);
            connection.send(JSON.stringify({
              data: JSON.stringify({
                contacts: dataForTransfer,
              }),
              event: EVENTS.transferContacts,
              issuer: connectionId,
              target: parsed.issuer,
            }));
          }

          if (parsed.event && parsed.event === EVENTS.transferComplete
            && parsed.target && parsed.target === connectionId) {
            setLoading(false);
          }
        };
      }
    },
    [
      connection,
      connectionId,
    ],
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
      { loading && (
        <Text>
          Loading...
        </Text>
      ) }
      { !loading && contactsData.length > 0 && (
        <FlatList
          data={contactsData}
          keyExtractor={(item: ExtendedContact): string => item.id}
          renderItem={renderItem}
          style={{
            maxWidth: '100%',
          }}
        />
      ) }
      { !loading && contactsData.length > 0 && !!connectionId && (
        <Pressable
          onPress={handleGenerateQR}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Generate QR
          </Text>
        </Pressable>
      ) }
      { !loading && dataForTransfer.length > 0 && (
        <QR value={connectionId} size={200} />
      ) }
    </View>
  );
}

export default memo(ShareContacts);
