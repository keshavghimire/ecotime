import {View, Text, Image, StatusBar, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function SplashScreen() {
  return (
    <View>
      <ImageBackground
        style={{height: hp('100%'), width: wp('100%')}}
        source={require('../../../assets/Image/Splash.png')}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#FFFFFF',
              fontSize: 52,
              fontWeight: '600',
            }}>
            eco.Time
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: '600',
            }}>
            Monitor Online Important Activities And {'\n'}Tasks Without Much
            Hassle
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
