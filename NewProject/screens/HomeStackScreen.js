import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Login from './Login';
import SeeAllPopular from './SeeAllPopular';

const Stack = createNativeStackNavigator()

const HomeStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='home-main' component={Home}/> 
        <Stack.Screen name='login' component={Login}/> 
        <Stack.Screen name="SeeAllPopular" component={SeeAllPopular} />
    </Stack.Navigator>
  )
}

export default HomeStackScreen