import { View, Text, StyleSheet, TextInput, TouchableOpacity,Alert, TouchableWithoutFeedback,Keyboard,ActivityIndicator,ToastAndroid } from 'react-native';
import React , {useState,useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import {useDispatch,useSelector} from 'react-redux'
import { login, loginAuth } from '../redux/apiCalls'
import {Gmail_auth} from '../components/Gmail_auth';
import Facebook_auth from '../components/Facebook_auth';
import { loginFailure, loginSuccess } from '../redux/LoginRedux';

const Login = ({ navigation }) => {

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [authData,setAuthdata]=useState([{navigate:navigation}])
  const dispatch=useDispatch()
  const [disable,setDisable]=useState(false)
  const {isFetching,error,currentUser,loadings}=useSelector((state)=>state.user)
  const handlePress=()=>{
    
    if(email && password){
      login(dispatch,{email,password,navigation,setDisable})
    }
    else{
      Alert.alert(
        "Login failed",
        "Please fill all fields",
        [
      {
        text: "Ok",
        onPress: () => {setDisable(false)},
      }
    ]
    );
    }
  }
  useEffect(() => {
    if(authData.length>1){
      loginAuth(dispatch,authData)
      //setDisable(false)
    }
    else{
      console.log("no data auth data");
      //setDisable(false)
    }
  }, [authData])

  if(error===true){
    ToastAndroid.showWithGravityAndOffset(  
      "No network connectivity",  
      ToastAndroid.SHORT,  
      ToastAndroid.BOTTOM,
      25,
      50 
      ); 
      dispatch(loginFailure(false))
      setTimeout(() => {
        setDisable(false)
      }, 1000);
  }
  return (

    <TouchableWithoutFeedback onPress={()=>{
      Keyboard.dismiss()
    }}>
    <View style={Style.main}>
      <View style={Style.dot1}></View>
      <View style={Style.dot2}></View>
      <View style={Style.e_container}>
        <View style={Style.e_container2}>
          <Text style={Style.e_container2_text1}>E commerce</Text>
          <Text style={Style.e_container2_text2}>App</Text>
        </View>
      </View>
      <View style={Style.dot3}></View>
      <View style={Style.log_container}>
        <View style={Style.log_container2}>
          <Text style={Style.log_container2_text}>Sign in</Text>
          <View style={Style.email_view}>
            <Text style={Style.email_view_text}><MaterialCommunityIcons name='email-outline' />  Email</Text>
            <TextInput value={email} selectionColor="black" style={Style.email_view_textinput} onChangeText={setEmail}/>
          </View>
          <View>
            <Text style={Style.email_view_text}><MaterialCommunityIcons name='lock-outline' />  Password</Text>
            <TextInput value={password} selectionColor="black" style={Style.email_view_textinput} secureTextEntry={true} onChangeText={setPassword}/>
          </View>
          <TouchableOpacity style={Style.forgot_btn} onPress={()=>navigation.navigate('Forgot')}>
            <Text style={Style.forgot_btn_text}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={disable} style={Style.login_btn} onPress={()=>{
            setDisable(true)
            handlePress();
            }}>
            {loadings===true?
            <ActivityIndicator size='large' color="white"/>:
            <Text style={Style.login_btn_text}>Login</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={Style.create_account_btn} onPress={() => navigation.navigate('Sign_up')}>
            <Text style={Style.create_account_btn_text}>Create account instead</Text>
          </TouchableOpacity>
          <View style={Style.auth_view}>
            <AntDesign disabled={disable} style={Style.auth_icon} name='google' onPress={()=>{
              setDisable(true)
              Gmail_auth(authData,setAuthdata,setDisable)
              }}/>
            <FontAwesome5Pro disabled={disable} style={Style.auth_icon} name='facebook' onPress={()=>{
              setDisable(true)
              Facebook_auth(authData,setAuthdata,setDisable)
            }}/>
          </View>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};
const Style = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5A56E9'
  },
  dot1: {
    backgroundColor: '#f5ae62',
    opacity: 0.7,
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    top: "-5%",
    right: "8%"
  },
  dot2: {
    borderWidth: 4,
    borderColor: 'rgba(158, 150, 150, .3)',
    width: 18,
    height: 18,
    borderRadius: 1000,
    position: "absolute",
    top: "2%",
    left: "25%"
  },
  e_container: {
    width: '100%',
    height: '25%',
    justifyContent: "center"
  },
  e_container2: {
    width: "70%",
    alignSelf: "center"
  },
  e_container2_text1: {
    color: "white", fontWeight: "bold", fontSize: 35, letterSpacing: 1
  },
  e_container2_text2: {
    color: "white", fontWeight: "bold", fontSize: 35, lineHeight: 35, letterSpacing: 2
  },
  dot3: {
    borderWidth: 4, borderColor: 'rgba(158, 150, 150, .3)', width: 25, height: 25, borderRadius: 1000, position: "absolute", top: "18%", right: "15%"
  },
  log_container: {
    width: '100%', height: '75%', backgroundColor: "white", borderTopRightRadius: 15, borderTopLeftRadius: 15, justifyContent: "center"
  },
  log_container2: {
    width: "80%", height: "85%", alignSelf: "center", justifyContent: "center"
  },
  log_container2_text: {
    color: "black", fontWeight: "bold", fontSize: 25, marginTop: -10
  },
  email_view: {
    marginVertical: 25
  },
  email_view_text: {
    color: "gray", fontSize: 15
  },
  email_view_textinput: {
    height: 30, padding: 5, borderBottomWidth: 1, color: "black"
  },
  forgot_btn: {
    width: "40%", marginVertical: 10
  },
  forgot_btn_text: {
    color: "#5A56E9", fontWeight: "bold"
  },
  login_btn: {
    width: "80%", height: 50, backgroundColor: "#5A56E9", borderRadius: 10, justifyContent: "center", alignItems: "center", alignSelf: "center", marginVertical: 5,
    flexDirection:"row"
  },
  login_btn_text: {
    color: "white", fontWeight: "bold",fontSize:17
  },
  create_account_btn: {
    width: "55%", justifyContent: "center", alignItems: "center", alignSelf: "center", marginVertical: 3
  },
  create_account_btn_text: {
    color: "#5A56E9", fontWeight: "bold"
  },
  auth_view: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 5, width: "25%", alignSelf: "center"
  },
  auth_icon: {
    fontSize: 30, color: "#5A56E9"
  }
});

export default Login;
