import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const About = () => {
  return (
    <View style={styles.main}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="circle" style={{color: 'black'}} />
        <Text style={{color: 'black', fontSize: 17,marginLeft:5,width:"95%"}}>
         
          Our clients interest is our top priority.
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="circle" style={{color: 'black'}} />
        <Text style={{color: 'black', fontSize: 17,marginLeft:5,width:"95%",paddingTop:17}}>
          
          Believe in honesty and integrity in everything we do.
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center',marginTop:10}}>
          <FontAwesome name="circle" style={{color: 'black'}} />
        <Text style={{color: 'black', fontSize: 17,marginLeft:5,width:"95%"}}>
        
          Effective and transparent communication.
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="circle" style={{color: 'black'}} />
        <Text style={{color: 'black', fontSize: 17,marginLeft:5,width:"95%",paddingTop:17}}>
        
          Building strong client relationships based on mutual respect.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding:"2%"
  },
});

export default About;
