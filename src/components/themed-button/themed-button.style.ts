import { StyleSheet } from 'react-native';

import { COLORS, FONTS, FONT_SIZE } from '../../constants/themes';

export const styles = StyleSheet.create({
  defaultButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    width: 311,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20,
    height: 46,
  },
  defaultButtonText: {
    alignSelf: 'center',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.small,
    color: COLORS.gray,
    margin: 5,
  },
  lightButtonText: {
    alignSelf: 'center',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.small,
    color: COLORS.white,
    margin: 5,
  },

  filled: {
    marginRight: 0,
    color: COLORS.white,
    backgroundColor: COLORS.lightGreen,
  },
  light: {
    marginRight: 0,
    color: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  lightBordered: {
    marginRight: 0,
    color: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.fonGray
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
