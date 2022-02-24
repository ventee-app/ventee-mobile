import { StyleSheet } from 'react-native';

import { COLORS, SPACER } from '../../constants';

export default StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    margin: SPACER,
    padding: SPACER,
  },
  buttonText: {
    color: COLORS.textInverted,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  contactContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: SPACER / 2,
    marginTop: SPACER,
    maxWidth: '100%',
  },
  contactName: {
    color: COLORS.text,
    fontSize: SPACER,
    marginLeft: SPACER / 2,
  },
});
