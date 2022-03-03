import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    margin: SPACER,
    padding: SPACER,
    width: '80%',
  },
  buttonText: {
    color: COLORS.textInverted,
    textAlign: 'center',
  },
});
