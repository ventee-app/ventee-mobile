import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  checkBox: {
    height: SPACER + SPACER / 2,
    width: SPACER + SPACER / 2,
  },
  contactContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: SPACER / 2,
    marginVertical: SPACER / 2,
    width: '100%',
  },
  contactName: {
    color: COLORS.text,
    fontSize: SPACER,
    marginLeft: SPACER / 2,
  },
  listControls: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.accent,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACER / 2,
    paddingVertical: SPACER / 2,
  },
  checkButton: {
    borderColor: COLORS.accent,
    padding: SPACER,
  },
  checkButtonText: {
    color: COLORS.accent,
    textAlign: 'center',
  },
  generateQRButton: {
    backgroundColor: COLORS.accent,
    flex: 1,
    padding: SPACER,
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
});
