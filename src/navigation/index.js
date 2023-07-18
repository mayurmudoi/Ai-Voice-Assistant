import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';

const Main = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Main.Navigator screenOptions={{headerShown: false}} initialRouteName='Welcome'>
        <Main.Screen name="Home" component={HomeScreen} />
        <Main.Screen name="Welcome" component={WelcomeScreen} />
    </Main.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};