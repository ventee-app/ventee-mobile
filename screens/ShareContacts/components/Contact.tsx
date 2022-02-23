import React, { memo } from 'react';
import Checkbox from 'expo-checkbox';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS, SPACER } from '../../../constants';

interface ContactProps {
  handleCheckBox: (id: string) => void;
  id: string;
  isChecked: boolean;
  name: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: SPACER,
    width: '100%',
  },
  name: {
    color: COLORS.text,
    fontSize: SPACER,
    marginLeft: SPACER / 2,
  },
});

function Contact(props: ContactProps): React.ReactElement {
  const {
    handleCheckBox,
    id,
    isChecked,
    name,
  } = props;

  const handleValueChange = () => handleCheckBox(id);

  return (
    <View style={styles.container}>
      <Checkbox
        color={COLORS.accent}
        onValueChange={handleValueChange}
        value={isChecked}
      />
      <Pressable
        onPress={handleValueChange}
        style={styles.name}
      >
        <Text>
          { name }
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(Contact);
