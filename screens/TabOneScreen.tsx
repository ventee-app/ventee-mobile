import React, { useEffect } from 'react';
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

async function getContacts() {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync();

    if (data.length > 0) {
      console.log('DUMP:', JSON.stringify(data));
    }
  }
}

export default function TabOneScreen(): React.ReactElement {
  useEffect(
    (): void => {
      getContacts();
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
