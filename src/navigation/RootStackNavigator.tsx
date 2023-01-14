import {View, Text} from 'react-native';
import React, {useState} from 'react';
import StackNavigator from './StackNavigator';
import AuthStackScreen from './AuthStackNavigator';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/AuthScreen/SplashScreen';
import HomeScreen from '../screens/MainScreen/HomeScreen';

const RootStack = createStackNavigator();

export default function RootStackNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading);

    //   setUser({});
    }, 500);
  }, []);

  return (
    <RootStack.Navigator
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      {isLoading ? (
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
      ) : user ? (
        <RootStack.Screen name="StackNavigator" component={StackNavigator} />
      ) : (
        <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      )}
    </RootStack.Navigator>
  );
}
