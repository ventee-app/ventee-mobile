import React, { memo } from 'react';
import Checkbox from 'expo-checkbox';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ContactProps {
  handleCheckBox: (id: string) => void;
  id: string;
  isChecked: boolean;
  name: string;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
        value={isChecked}
        onValueChange={handleValueChange}
      />
      <Text>
        { name }
      </Text>
    </View>
  );
}

export default memo(Contact);
