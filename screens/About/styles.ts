import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.accent,
    fontSize: SPACER * 2,
    fontWeight: 'bold',
  },
  description: {
    color: COLORS.text,
    fontSize: SPACER + SPACER / 4,
    marginTop: SPACER,
    textAlign: 'center',
  },
  linkText: {
    color: COLORS.accent,
    fontSize: SPACER + SPACER / 4,
    textDecorationLine: 'underline',
  },
  linkWrap: {
    marginTop: SPACER,
  },
});
