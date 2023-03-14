import { StyleSheet,StatusBar } from 'react-native';
import React,{useState} from 'react';
import Home_inside from '../components/slider/Home_inside';
import { NativeBaseProvider } from "native-base";

const Home = ({ navigation }) => {
  
  return (
    <NativeBaseProvider>
        <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "black" />
        <Home_inside navigate={navigation} />
      
    </NativeBaseProvider> 
  )
};

const styles = StyleSheet.create({

});

export default Home;