import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {useNavigation} from '@react-navigation/native';
import HomeScreen from '../screens/MainScreen/HomeScreen';

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#3083E1',
   
  },
//   headerTitleAlign: 'flex-start',
  headerTintColor: 'white',
};


const MainStackNavigator = props => {
  const navigation = useNavigation();

  // const onDrawer = () => {
  //   navigation.toggleDrawer();
  // };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',

          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            // fontSize:hp('2.5%')
          },

        
          // headerRight: () => (
          //   <SafeAreaView
          //     style={
          //       {
          //         // marginTop: 50
          //       }
          //     }
          //   >
          //     <View
          //       style={{
          //         flexDirection: "row",
          //         marginRight: 10,
          //       }}
          //     >
          //       <TouchableOpacity onPress={() => onDrawer()}>
          //         <MaterialCommunityIcons name="menu" size={35} color="#FFF" />
          //       </TouchableOpacity>
          //     </View>
          //   </SafeAreaView>
          // ),
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
