import React, { memo } from 'react';
import {
  Text,
  View,
} from 'react-native';

function ReceiveContacts(): React.ReactElement {
  return (
    <View>
      <Text>
        Receive contacts
      </Text>
    </View>
  );
}

export default memo(ReceiveContacts);
