import React, { memo } from 'react';
import Checkbox from 'expo-checkbox';
import {
  Dimensions,
  Pressable,
  Text,
  View,
} from 'react-native';

import { COLORS, SPACER } from '../../../../constants';
import styles from '../../styles';

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
        style={styles.checkBox}
        value={isChecked}
      />
      <Pressable onPress={handleValueChange}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            ...styles.contactName,
            color: !isChecked
              ? COLORS.textMuted
              : styles.contactName.color,
            width: Dimensions.get('screen').width - SPACER * 3,
          }}
        >
          { name }
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(Contact);
