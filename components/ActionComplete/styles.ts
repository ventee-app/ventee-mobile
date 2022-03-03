import { StyleSheet } from 'react-native';

import { SPACER } from '../../constants';

export default StyleSheet.create({
  actionCompleteText: {
    fontSize: SPACER + SPACER / 4,
    marginVertical: SPACER * 2,
  },
  closeButton: {
    marginTop: SPACER * 2,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
