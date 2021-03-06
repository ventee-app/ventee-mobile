import React, {
  memo,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Keyboard,
  View,
} from 'react-native';
import * as Contacts from 'expo-contacts';

import ActionComplete from '../../components/ActionComplete';
import context, { ContextStorage } from '../../store';
import EmptyList from './components/EmptyList';
import { EVENTS } from '../../constants';
import { ExtendedContact, WebsocketMessageData } from '../../types/data-models';
import ContactsList from '../../components/ContactsList';
import QRCode from './components/QRCode';
import Spinner from '../../components/Spinner';
import styles from './styles';
import useWebsockets from '../../hooks/use-websockets';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [readyForTransfer, setReadyForTransfer] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [transferComplete, setTransferComplete] = useState<boolean>(false);

  useEffect(
    (): void => {
      getContacts().then((result: null | Contacts.ContactResponse): void => {
        if (!result) {
          return Alert.alert(
            'Contacts access denied!',
            'Please provide access to the contacts!',
          );
        }
        return setContactsData(
          result.data.reduce(
            (array: ExtendedContact[], item: Contacts.Contact): ExtendedContact[] => {
              if (item.name) {
                array.push({
                  ...item,
                  isChecked: true,
                });
              }
              return array;
            },
            [],
          ),
        );
      }).catch((): void => {
        Alert.alert(
          'Contacts request failed',
          'Failed to load the contacts!',
        );
      });
    },
    [],
  );

  const handleCheckAll = (): void => setContactsData(
    (state: ExtendedContact[]): ExtendedContact[] => state.map(
      (item: ExtendedContact): ExtendedContact => ({
        ...item,
        isChecked: true,
      }),
    ),
  );

  const handleCheckBox = (id: string): void => setContactsData(
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

  const handleCloseTransferComplete = () => {
    setReadyForTransfer(false);
    setTransferComplete(false);
  };

  const handleIncomingMessage = (message: MessageEvent<string>): void => {
    const parsed: WebsocketMessageData = JSON.parse(message.data);

    if (parsed.event === EVENTS.requestContacts
      && parsed.issuer && parsed.target && parsed.target === connectionId) {
      setLoading(true);
      if (connection && connectionId) {
        setContactsData((state: ExtendedContact[]): ExtendedContact[] => {
          connection.send(JSON.stringify({
            data: JSON.stringify({
              contacts: state.filter(
                (item: ExtendedContact): boolean => item.isChecked,
              ),
            }),
            event: EVENTS.transferContacts,
            issuer: connectionId,
            target: parsed.issuer,
          }));

          return state;
        });
      }
    }

    if (parsed.event && parsed.event === EVENTS.transferComplete
      && parsed.target && parsed.target === connectionId) {
      setLoading(false);
      setTransferComplete(true);
    }
  };

  const handleShowQR = (): void => setReadyForTransfer((state: boolean): boolean => !state);

  const handleUncheckAll = (): void => setContactsData(
    (state: ExtendedContact[]): ExtendedContact[] => state.map(
      (item: ExtendedContact): ExtendedContact => ({
        ...item,
        isChecked: false,
      }),
    ),
  );

  useEffect(
    (): (() => void) => {
      if (connection && connectionId) {
        setLoading(false);

        connection.addEventListener('message', handleIncomingMessage);
      }
      return (): void => {
        if (connection && connectionId) {
          connection.removeEventListener('message', handleIncomingMessage);
        }
      };
    },
    [
      connection,
      connectionId,
    ],
  );

  return (
    <View style={styles.container}>
      { loading && (
        <Spinner />
      ) }
      { !loading && !readyForTransfer
        && !transferComplete && contactsData.length > 0 && (
        <ContactsList
          actionButtonText="Generate QR"
          contacts={contactsData}
          handleActionButton={handleShowQR}
          handleCheckAll={handleCheckAll}
          handleCheckBox={handleCheckBox}
          handleClearSearch={handleClearSearch}
          handleUncheckAll={handleUncheckAll}
          searchValue={search}
          setSearch={setSearch}
          type="share"
        />
      ) }
      { !loading && !readyForTransfer
        && !transferComplete && contactsData.length === 0 && (
        <EmptyList />
      ) }
      { !loading && readyForTransfer
        && !transferComplete && !!connectionId && (
        <QRCode
          handleCloseQR={handleShowQR}
          transferAmount={
            contactsData.filter((item: ExtendedContact): boolean => item.isChecked).length
          }
          value={connectionId}
        />
      ) }
      { !loading && transferComplete && (
        <ActionComplete
          actionText="Transfer complete!"
          handleClose={handleCloseTransferComplete}
        />
      ) }
    </View>
  );
}

export default memo(ShareContacts);
