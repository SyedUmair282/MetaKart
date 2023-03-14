import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const FlatButton = ({text,onPress}) => {
  return (
      <TouchableOpacity onPress={onPress}>
          <View style={Style.button}>
              <Text style={Style.BtnText}>{text}</Text>
          </View>
      </TouchableOpacity>
  )
}

export default FlatButton

const Style = StyleSheet.create({
    button:{
        backgroundColor:'#5A56E9',
        width:'40%',
        alignSelf:'center',
        height:40,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:15,
        borderRadius:15,
    },
    BtnText:{
        color:'whitesmoke',
        fontSize:18,
        fontWeight:'bold',
    }
})