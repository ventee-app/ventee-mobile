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

import context, { ContextStorage } from '../../store';
import EmptyList from './components/EmptyList';
import { EVENTS } from '../../constants';
import { ExtendedContact, WebsocketMessageData } from '../../types/data-models';
import List from './components/List';
import QRCode from './components/QRCode';
import Spinner from '../../components/Spinner';
import styles from './styles';
import TransferComplete from './components/TransferComplete';
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
        && parsed.issuer && parsed.target) {
      setLoading(true);
      if (connection && connectionId) {
        connection.send(JSON.stringify({
          data: JSON.stringify({
            contacts: contactsData.filter((item: ExtendedContact): boolean => item.isChecked),
          }),
          event: EVENTS.transferContacts,
          issuer: connectionId,
          target: parsed.issuer,
        }));
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
        <List
          contacts={contactsData}
          handleCheckAll={handleCheckAll}
          handleCheckBox={handleCheckBox}
          handleClear={handleClearSearch}
          handleGenerateQR={handleShowQR}
          handleUncheckAll={handleUncheckAll}
          searchValue={search}
          setSearch={setSearch}
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
        <TransferComplete handleClose={handleCloseTransferComplete} />
      ) }
    </View>
  );
}

export default memo(ShareContacts);
