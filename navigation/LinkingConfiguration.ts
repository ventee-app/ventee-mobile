import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';

import { RootStackParamList } from '../types/navigation';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      About: 'about',
      Root: {
        screens: {
          ShareContacts: {
            screens: {
              ShareContactsScreen: 'share',
            },
          },
          ReceiveContacts: {
            screens: {
              ReceiveContactsScreen: 'receive',
            },
          },
        },
      },
    },
  },
};

export default linking;
