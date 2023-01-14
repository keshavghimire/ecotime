import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const globalstyles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#2981E1',
    margin: 0,
    padding: 0,
  },
  maincontainer: {
    padding: 10,
    margin: 10,
  },

  whitetext: {
    color: '#ffffff',
  },
  blacktext: {
    color: '#000000',
  },
  bluetext: {
    color: '#3083E1',
  },
  greytext: {
    color: '#B2B2B2',
  },
  darkgrey: {
    color: '#676565',
  },

  // All font sizes

  font12: {
    fontSize: 12,
  },

  font10: {
    fontSize: 10,
  },
  font13: {
    fontSize: 13,
  },
  font15: {
    fontSize: 15,
  },
  font16: {
    fontSize: 16,
  },
  font17: {
    fontSize: 17,
  },
  font20: {
    fontSize: 20,
  },
  font24: {
    fontSize: 24,
  },
  font22: {
    fontSize: 22,
  },
  font32: {
    fontSize: 32,
  },
  font35: {
    fontSize: 35,
  },
  font100: {
    fontSize: 100,
  },
});
