import React, { memo } from 'react';
import Checkbox from 'expo-checkbox';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../../constants';
import styles from '../styles';

interface ContactProps {
  handleCheckBox: (id: string) => void;
  id: string;
  isChecked: boolean;
  name: string;
}

function Contact(props: ContactProps): React.ReactElement {
  const {
    handleCheckBox,
    id,
    isChecked,
    name,
  } = props;

  const handleValueChange = () => handleCheckBox(id);

  return (
    <View style={styles.contactContainer}>
      <Checkbox
        color={COLORS.accent}
        onValueChange={handleValueChange}
        value={isChecked}
      />
      <Pressable onPress={handleValueChange}>
        <Text
          style={{
            ...styles.contactName,
            color: !isChecked
              ? COLORS.textMuted
              : styles.contactName.color,
          }}
        >
          { name }
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(Contact);
