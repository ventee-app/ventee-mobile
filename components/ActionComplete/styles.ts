import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  actionCompleteText: {
    fontSize: SPACER + SPACER / 4,
    marginVertical: SPACER * 2,
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    marginTop: SPACER * 2,
    padding: SPACER,
    width: '80%',
  },
  closeButtonText: {
    color: COLORS.textInverted,
    fontSize: SPACER,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
