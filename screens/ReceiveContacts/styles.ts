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
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
  },
  scanner: {
    height: '80%',
    width: '100%',
  },
});
