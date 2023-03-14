import React, {useReducer} from 'react';
import {Text} from 'react-native';
import Home from './screens/Home';
import Favourites from './screens/Favourites';
import Notification from './screens/Notification';
import Orders from './screens/Orders';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Tab = createBottomTabNavigator();
const BottomNav = () => {


  return (
      <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({route})=>({
        tabBarIcon:({focused,color,size})=>{
          let iconName;
          let rn=route.name;
          if(rn==='Home'){
            iconName=focused?'home':'home-outline';
          }
          else if(rn==='Favourites'){
            iconName=focused?'heart':'heart-outline';
          }
          else if(rn==='Notification'){
            iconName=focused?'bell':'bell-outline';
          }
          else if(rn==='Orders'){
            iconName=focused?'view-list':'view-list-outline';
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color='#5A56E9'/>
          )
        },
        headerShown:false,
        tabBarHideOnKeyboard:true,
        
      })}
      
      >
        <Tab.Screen name="Home"  component={Home} options={{
          tabBarLabel: () => (
            <Text style={{color: "#5A56E9",fontSize:12,flexDirection:"column"}}>Home</Text>
          ),
          //unmountOnBlur:true      
        }} />
        <Tab.Screen name="Favourites" component={Favourites} options={{
          tabBarLabel: () => (
            <Text style={{color: "#5A56E9",fontSize:12}}>Favourites</Text>
          ), 
          unmountOnBlur:true
        }} />
        <Tab.Screen name="Notification" component={Notification} options={{
          tabBarLabel: () => (
            <Text style={{color: "#5A56E9",fontSize:12}}>Notification</Text>
          ),
          unmountOnBlur:true
        }}/>
        <Tab.Screen name="Orders" component={Orders} options={{
          tabBarLabel: () => (
            <Text style={{color: "#5A56E9",fontSize:12}}>Orders</Text>
          ),
          unmountOnBlur:true
        }}/>
      </Tab.Navigator>
    
  );
};

export default BottomNav;