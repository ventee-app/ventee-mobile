import { StyleSheet } from 'react-native';

import { COLORS } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  ring: {
    borderColor: COLORS.accent,
    borderRadius: 40,
    borderWidth: 10,
    height: 80,
    position: 'absolute',
    width: 80,
  },
});
