import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import GroupListScreen from './Screens/GroupListScreen'; 
<<<<<<< HEAD
import ChatScreen from './Screens/ChatScreen';
=======
//import ChatScreen from './Screens/ChatScreen';
>>>>>>> e4110ad7cf14606ed29b63bae40089b628a401eb

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="GroupList" component={GroupListScreen} /> 
<<<<<<< HEAD
        <Stack.Screen name="Chat" component={ChatScreen} />
=======
        {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
>>>>>>> e4110ad7cf14606ed29b63bae40089b628a401eb
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;