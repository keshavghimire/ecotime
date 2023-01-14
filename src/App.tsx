import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/MainScreen/HomeScreen';
import SplashScreen from './screens/AuthScreen/SplashScreen';
import RootStackNavigator from './navigation/RootStackNavigator';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
    <RootStackNavigator/>
    </NavigationContainer>
  );
}

export default App;
