import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  generateQRButtonText: {
    color: COLORS.textInverted,
    textAlign: 'center',
  },
  emptyListContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyList: {
    color: COLORS.text,
    fontSize: SPACER + SPACER / 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeQRCodeButton: {
    backgroundColor: COLORS.accent,
    marginTop: SPACER * 2,
    padding: SPACER,
    width: '80%',
  },
  transferAmountText: {
    color: COLORS.text,
    fontSize: SPACER,
    marginBottom: SPACER * 2,
    textAlign: 'center',
  },
  contactsTransferredText: {
    fontSize: SPACER + SPACER / 4,
    marginVertical: SPACER * 2,
  },
});
