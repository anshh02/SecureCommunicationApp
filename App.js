import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './Screens/LoginScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import GroupListScreen from './Screens/GroupListScreen'; 
import ChatScreen from './Screens/ChatScreen';
//import AdminDashboardScreen from './Screens/AdminDashboardScreen';

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
        <Stack.Screen name="Chat" component={ChatScreen} /> 
        {/* <Stack.Screen name="Admin" component={AdminDashboardScreen} />  */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;