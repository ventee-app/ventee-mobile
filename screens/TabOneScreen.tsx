import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

const styles = StyleSheet.create({
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

export default function TabOneScreen(): React.ReactElement {
  const [contactsData, setContactsData] = useState<Contacts.Contact[]>([]);

  useEffect(
    (): void => {
      getContacts().then((result: null | Contacts.ContactResponse) => {
        if (result) {
          const { data } = result;
          setContactsData(data);
        }
      }).catch((error) => {
        console.log(error);
      });
      const WSC = new WebSocket('ws://localhost:9099');
      WSC.onopen = (): void => {
        console.log('opened connection');
      };
      WSC.onclose = (reason): void => {
        console.log('closed connection', reason);
      };
      WSC.onmessage = (message: MessageEvent): void => {
        console.log('received message', message.data);
        try {
          const parsed = JSON.parse(message.data);
          if (parsed.event === 'register-connection') {
            return console.log('register connection with id', parsed.data.connectionId);
          }
          return console.log('parsed', parsed);
        } catch {
          return console.log('could not parse');
        }
      };
    },
    [],
  );

  const handlePress = async () => {
    if (Platform.OS === 'ios') {
      const id = await Contacts.addContactAsync(
        {
          contactType: 'person',
          phoneNumbers: [
            {
              label: 'work',
              id: '516',
              isPrimary: false,
              number: '',
            },
          ],
          firstName: '',
          name: '',
          id: '197',
          imageAvailable: false,
        },
      );
      console.log('ID:', id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Pressable onPress={handlePress}>
        <Text>
          Save contact
        </Text>
      </Pressable>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}
