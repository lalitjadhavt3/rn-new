/* fonts */
import {StyleSheet} from 'react-native';
export const FontFamily = {
  footnoteBold: 'SF Pro Display_semibold',
  caption2Regular: 'SF Pro Display_regular',
  caption1Bold: 'SF Pro Display_medium',
  title2Bold: 'SF Pro Display_bold',
};
/* font sizes */
export const FontSize = {
  size_base_1: 15,
  caption2Regular_size: 11,
  footnoteBold_size: 13,
  caption1Bold_size: 12,
  headlineBold_size: 17,
  size_5xs_2: 7,
  title2Bold_size: 22,
  size_base: 16,
};
/* Colors */
export const Color = {
  white: '#fff',
  systemColoursDefaultColorsSystemWhiteBlackDark: '#000',
  greySecondary: '#acacac',
  greyPrimary: '#969696',
  primaryBlue: '#185dcf',
  black: '#2e2e2e',
  greyText: '#626262',
  aliceblue: '#f4fbff',
  greyBackground: '#f5f5f5',
};
/* Paddings */
export const primaryBg = '#5A6DF9';
export const Padding = {
  p_6xl_9: 26,
  p_sm_4: 13,
  p_5xl_9: 25,
  p_xs_5: 12,
  p_7xs: 6,
  p_3xs: 10,
  p_mini: 15,
  p_xs: 12,
  p_mid: 17,
};
/* border radiuses */
export const Border = {
  br_76xl_9: 96,
  br_5xs: 8,
  br_9xs: 4,
  br_6xs_9: 7,
  br_3xs: 10,
};
// styles.js

export const globalStyles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Bold', // Replace with your font's name
  },

  secondaryBg: {
    backgroundColor: '#FF725E',
  },
});
