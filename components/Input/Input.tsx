import React, { memo } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import {
  Dimensions,
  Pressable,
  TextInput,
  View,
} from 'react-native';

import { COLORS, SPACER } from '../../constants';
import styles from './styles';

interface InputProps {
  handleClear: () => void;
  handleInput: (value: string) => void;
  placeholder: string;
  placeholderColor?: string;
  value: string;
}

function Input(props: InputProps): React.ReactElement {
  const {
    handleClear,
    handleInput,
    placeholder,
    placeholderColor,
    value,
  } = props;

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={handleInput}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        selectionColor={COLORS.accent}
        style={{
          ...styles.input,
          width: Dimensions.get('screen').width - (SPACER * 2 + SPACER / 2),
        }}
        value={value}
      />
      <Pressable
        onPress={handleClear}
        style={styles.clearButton}
      >
        <EvilIcons
          color={value.length > 0 ? COLORS.accent : COLORS.textMuted}
          name="close"
          size={SPACER + (SPACER / 2)}
        />
      </Pressable>
    </View>
  );
}

Input.defaultProps = {
  placeholderColor: COLORS.textMuted,
};

export default memo(Input);
