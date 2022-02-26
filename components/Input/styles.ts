import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
    height: SPACER * 2,
    justifyContent: 'center',
    marginRight: SPACER / 2,
    width: SPACER * 2,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderColor: COLORS.accent,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  input: {
    backgroundColor: COLORS.background,
    fontSize: SPACER,
    paddingVertical: SPACER,
    paddingHorizontal: SPACER,
  },
});
