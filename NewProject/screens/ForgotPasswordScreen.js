import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard,ToastAndroid } from 'react-native'
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';



const ForgotPasswordScreen = ({ navigation }) => {
  const navigate = useNavigation();
  const [text, onChangeText] = useState('');
  const [isError, setError] = useState(false);
  const [disable, setDisable] = useState(false);
  const [overlay,setOverlay]=useState(false)

  const onSend = async () => {
    try {
      if(text){
        setDisable(true)
        setOverlay(true)
    const res = await axios.post('http://192.168.1.9:5000/sql/sendOTP',{email:text})
    if (res.data) {
      setError(false)
      setDisable(false)
      setOverlay(false)
      navigation.navigate('Verification',{email:text});
    } else {
      setError(true);
      setDisable(false)
      setOverlay(false)
    }
      }
      else{
        ToastAndroid.showWithGravityAndOffset(  
          "Field is required!",  
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50 
        )
      }
  } catch (error) {
    console.log("error",error);
    if(error == "AxiosError: Network Error"){
      ToastAndroid.showWithGravityAndOffset(  
        "No network connectivity",  
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50 
      )
      setDisable(false)
      setOverlay(false)
  }
  setDisable(false)
  setOverlay(false)
  }
}

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss()
    }}>
      <View>
      <Spinner
          visible={overlay}
        />
        <View style={styles.mainHeader}>
          <View style={styles.innerHeader}>
            <View style={styles.innerHeader1}>
              <Icon
                style={styles.backBtn}
                name="chevron-back"
                onPress={() => navigate.goBack()}
              />
              <Text style={styles.text}>Forgot Password</Text>

            </View>
          </View>
        </View>

        <View style={styles.descParent}>

          <View style={styles.desc}>
            <Text style={styles.descText}>Enter the email address that you created your account with.</Text>
          </View>
        </View>

        <View style={styles.section1} >
          <View style={styles.emailBox}>
            <Text style={styles.email}>Enter Email Address</Text>
          </View>
          <TextInput
          autoFocus={true}
            style={styles.inputEmail}
            onChangeText={onChangeText}
            keyboardType={'email-address'}
            value={text}
            placeholder='example@gmail.com'
          />
          {
            isError ? (
              <Text style={{color:'red' , fontSize:16, alignSelf:'center',marginBottom:'3%'}}>There is no account on this email address!</Text>
            ):(null)
          }

          <TouchableOpacity style={{ alignItems: 'center', marginLeft: '25%', width: '50%' }} disabled={disable}>
            <Text style={{ fontSize: 16 }} onPress={() => navigate.goBack()}>Back to sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.sendEmail_btn} onPress={onSend} disabled={disable}>
            <Text style={styles.sendEmail_btn_text}>Send</Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>

  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
  mainHeader: {
    // borderWidth: 2,
    borderColor: 'black',
    height: '12%',
    marginTop: "2%",
    // marginVertical:'1%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  innerHeader: {
    // borderWidth: 2,
    marginVertical: '2%',
    height: '80%',
    width: '100%',
    borderColor: 'red',
    flexDirection: 'row',
    alignItems: 'center'

  },
  innerHeader1: {
    width: '100%',
    height: '100%',
    // borderWidth: 2,
    borderColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: '#222222',
    fontSize: 23,
    fontWeight: '500'
  },
  backBtn: {
    fontSize: 25,
    color: '#888888',
    position: 'absolute',
    zIndex: 999,
    // top: 6,
    left: 15,
  },
  section1: {
    marginTop: '15%',

  },
  inputEmail: {

    height: 60,
    margin: 12,
    borderRadius: 30,
    borderColor: 'silver',
    borderWidth: 2,
    padding: 10,
    marginVertical: 25,


  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',

  },
  emailBox: {
    // borderWidth:2,
    alignItems: 'center'

  },
  sendEmail_btn: {
    width: "90%", height: 60, backgroundColor: "#5A56E9", borderRadius: 30, justifyContent: "center", alignItems: "center", alignSelf: "center", marginVertical: "10%",
    flexDirection: "row"
  },
  sendEmail_btn_text: {
    color: "white", fontWeight: "bold", fontSize: 17
  },
  desc: {
    // borderWidth:2,
    width: '90%',

  },
  descText: {
    fontSize: 18,
    textAlign: 'center'

  },
  descParent: {
    // borderWidth:2,
    alignItems: 'center',
    marginTop: '10%',

  }
})