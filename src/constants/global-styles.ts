export const globalStyles = {
  // Text
  labelTextThin: 'text-darkGray font-regular text-sm',
  regularGrayText: 'text-gray font-regular text-sm',
  regularBlackText: 'text-black font-regular text-sm',
  extraSmallGrayText: 'text-gray text-xs font-normal tracking-tight leading-20',
  smallGrayText: 'text-gray text-sm font-regular tracking-tight',
  smallWhiteText: 'text-white text-sm font-regular tracking-tight',
  smallLightGreenText: 'text-lightGreen text-sm font-regular tracking-tight',
  boldText: 'text-darkGray font-semibold text-sm',
  grayMediumText: 'text-gray font-medium text-sm',
  grayAvatarText: 'text-gray font-medium text-xs',
  hugeGrayText: 'text-textGray font-medium text-lg',
  greenMediumText: 'text-lightGreen font-medium text-sm',
  greenRegularText: 'text-lightGreen text-sm font-regular',
  greenHeaderText: 'text-lightGreen font-bold text-lg',
  boldBlackText: 'text-black font-bold text-md',
  semiboldBlackText: 'text-black font-semibold text-md',

  headText: 'font-bold text-lg',
  hugeText: 'font-bold text-xl',
  headScreen: 'mt-18 mb-7 font-bold text-xl',

  // Decoration
  topGrayBorder: 'border-t border-borderGray',
  bottomGrayBorder: 'border-b border-borderGray',
  shadow: 'shadow',

  // Wrappers
  wrapper: 'flex flex-col flex-1 bg-white',
  scrollWrapper: 'flex flex-col bg-white',
  linkButtonWrapper:
    'items-center justify-center w-full h-68 border-t border-borderGray',
  bottomWindow:
    'h-250 pb-30 rounded-t-20 rounded-b-20 w-full bg-gray-200 shadow items-center justify-around',
  fullHeight: 'flex-1',
  verticalOffset: 'py-20',
  horizontalOffset: 'px-20',
  modalMainButton: 'w-257',
};

// import {StyleSheet} from 'react-native';
// import {FONTS, COLORS, FONT_SIZE} from './themes';
// import {Env} from './device-env';

// export const globalStyles = StyleSheet.create({
//   // Text
//   labelTextThin: {
//     color: COLORS.darkGray,
//     fontFamily: FONTS.regular,
//     fontSize: FONT_SIZE.small,
//   },
//   regularGrayText: {
//     color: COLORS.gray,
//     fontFamily: FONTS.regular,
//     fontSize: FONT_SIZE.small,
//   },
//   regularBlackText: {
//     color: COLORS.black,
//     fontFamily: FONTS.regular,
//     fontSize: FONT_SIZE.small,
//   },
//   extraSmallGrayText: {
//     color: COLORS.gray,
//     fontSize: FONT_SIZE.extraSmall,
//     letterSpacing: 0.25,
//     lineHeight: 20,
//   },
//   smallGrayText: {
//     color: COLORS.gray,
//     fontSize: FONT_SIZE.smallest,
//     fontFamily: FONTS.regular,
//     letterSpacing: 0.25,
//   },
//   smallWhiteText: {
//     color: COLORS.white,
//     fontSize: FONT_SIZE.smallest,
//     fontFamily: FONTS.regular,
//     letterSpacing: 0.25,
//   },
//   smallLightGreenText: {
//     color: COLORS.lightGreen,
//     fontSize: FONT_SIZE.smallest,
//     fontFamily: FONTS.regular,
//     letterSpacing: 0.25,
//   },
//   boldText: {
//     color: COLORS.darkGray,
//     fontFamily: FONTS.semiBold,
//     fontSize: FONT_SIZE.small,
//   },
//   grayMediumText: {
//     color: COLORS.gray,
//     fontFamily: FONTS.medium,
//     fontSize: FONT_SIZE.small,
//   },
//   grayAvatarText: {
//     color: COLORS.gray,
//     fontFamily: FONTS.medium,
//     fontSize: FONT_SIZE.smallest,
//   },
//   hugeGrayText: {
//     color: COLORS.textGray,
//     fontFamily: FONTS.medium,
//     fontSize: FONT_SIZE.mediumBigger,
//   },
//   greenMediumText: {
//     color: COLORS.lightGreen,
//     fontFamily: FONTS.medium,
//     fontSize: FONT_SIZE.small,
//   },
//   greenRegularText: {
//     color: COLORS.lightGreen,
//     fontSize: FONT_SIZE.small,
//     fontFamily: FONTS.regular,
//   },
//   greenHeaderText: {
//     color: COLORS.lightGreen,
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.big,
//   },
//   boldBlackText: {
//     fontSize: FONT_SIZE.mediumSmall,
//     fontFamily: FONTS.bold,
//     color: COLORS.black,
//   },
//   semiboldBlackText: {
//     fontSize: FONT_SIZE.mediumSmall,
//     fontFamily: FONTS.semiBold,
//   },

//   headText: {
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.mediumBigger,
//   },
//   hugeText: {
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.big,
//   },
//   headScreen: {
//     marginTop: 18,
//     marginBottom: 7,
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.big,
//   },

//   // Decoration
//   topGrayBorder: {
//     borderTopColor: COLORS.borderGray,
//     borderTopWidth: 1,
//   },
//   bottomGrayBorder: {
//     borderBottomColor: COLORS.borderGray,
//     borderBottomWidth: 1,
//   },
//   shadow: {
//     shadowColor: COLORS.darkGray,
//     shadowOffset: {width: 0, height: 8},
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//   },

//   // Wrappers
//   wrapper: {
//     display: 'flex',
//     flexDirection: 'column',
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   scrollWrapper: {
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: COLORS.white,
//   },
//   linkButtonWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     height: 68,
//     borderTopColor: COLORS.borderGray,
//     borderTopWidth: 1,
//   },
//   bottomWindow: {
//     height: 250,
//     paddingBottom: Env.isIOS ? 30 : 0,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     width: '100%',
//     backgroundColor: '#EEE',
//     shadowColor: '#000000',
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     shadowOffset: {
//       height: 0,
//       width: 0,
//     },
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   fullHeight: {flex: 1},
//   verticalOffset: {
//     paddingVertical: 20,
//   },
//   horizontalOffset: {
//     paddingHorizontal: 20,
//   },
//   modalMainButton: {
//     width: 257,
//   },
// });
