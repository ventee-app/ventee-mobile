import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';

import styles from './styles';

interface BigButtonProps {
  buttonStyles?: object;
  disabled?: boolean;
  disabledButtonStyles?: object;
  handlePress: () => void;
  text: string;
  textStyles?: object;
}

function BigButton(props: BigButtonProps): React.ReactElement {
  const {
    buttonStyles,
    disabled,
    disabledButtonStyles,
    handlePress,
    text,
    textStyles,
  } = props;

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={{
        ...styles.button,
        ...buttonStyles,
        ...disabledButtonStyles,
      }}
    >
      <Text
        style={{
          ...styles.buttonText,
          ...textStyles,
        }}
      >
        { text }
      </Text>
    </Pressable>
  );
}

BigButton.defaultProps = {
  buttonStyles: {},
  disabled: false,
  disabledButtonStyles: {},
  textStyles: {},
};

export default memo(BigButton);
