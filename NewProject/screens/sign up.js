import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../redux/apiCalls';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Gmail_auth from '../components/Gmail_auth';
import Facebook_auth from '../components/Facebook_auth';
import {registerFailure} from '../redux/RegisterRedux';

const Sign_up = ({navigation}) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPswd] = useState('');
  const [confirmPswd, setConfirmPswd] = useState('');
  const [dataBody, setDataBody] = useState({});
  const dispatch = useDispatch();
  const {isFetching, error, currentUser, loadings} = useSelector(
    state => state.register,
  );

  // Alert.alert('helllp', '', [
  //   {
  //     text: 'Ok',
  //     onPress: () => console.log('Ok'),
  //   },
  // ]);

  const handlePress = () => {
    if (
      first_name &&
      last_name &&
      username &&
      // mobile &&
      email &&
      password &&
      confirmPswd
    ) {
      if (password === confirmPswd) {
        let payload = {
          username,
          email,
          password,
         // mobile,
          first_name,
          last_name,
          navigation,
        };
        if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
          setDataBody({...payload});
          register(dispatch, payload);
        } else {
          Alert.alert('Registeration failed', 'Invalid email', [
            {
              text: 'Ok',
              onPress: () => console.log('Ok'),
            },
          ]);
        }
      } else {
        Alert.alert('Registeration failed', 'Password not matched', [
          {
            text: 'Ok',
            onPress: () => console.log('Ok'),
          },
        ]);
      }
    } else {
      Alert.alert('Registeration failed', 'Please fill all fields', [
        {
          text: 'Ok',
          onPress: () => console.log('Ok'),
        },
      ]);
    }
  };
  if (error === true) {
    Alert.alert('Login failed', 'Something went wrong', [
      {
        text: 'Ok',
        onPress: () => dispatch(registerFailure(false)),
      },
    ]);
  }

  //============================ UMER

  const firstFlagCheck = input => {
    if (input.length > 15) {
      Alert.alert('Input Error', 'cant be greater than 15 char', [
        {
          text: 'Ok',
        },
      ]);
    } else {
      let checkFlag = /^[a-zA-Z]+$/.test(input);
      if (checkFlag || input.length === 0) {
        setFirstName(input);
      } else {
        Alert.alert('Input Error', "Name can't have other than alphabets'", [
          {
            text: 'Ok',
          },
        ]);
      }
    }
  };
  const lastFlagCheck = input => {
    if (input.length > 15) {
      Alert.alert('Input Error', 'cant be greater than 15 char', [
        {
          text: 'Ok',
        },
      ]);
    } else {
      let checkFlag = /^[a-zA-Z]+$/.test(input);
      if (checkFlag || input.length === 0) {
        setLastName(input);
      } else {
        Alert.alert('Input Error', "Name can't have other than alphabets'", [
          {
            text: 'Ok',
          },
        ]);
      }
    }
  };
  const usernameFlagCheck = input => {
    if (input.length > 25) {
      Alert.alert('Input Error', 'cant be greater than 25 char', [
        {
          text: 'Ok',
        },
      ]);
    } else {
      
        setUsername(input);
      
    }
  };

  return (
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={Style.log_container2}>
            <Text style={Style.log_container2_text}>Sign up</Text>
            <View style={Style.fl_name_view}>
              <View>
                <Text style={Style.fl_name_view_text}>
                  <FontAwesome name="user-circle-o" /> First Name
                </Text>
                <TextInput
                  value={first_name}
                  selectionColor="black"
                  style={Style.fl_name_view_input}
                  onChangeText={e => {
                    firstFlagCheck(e);
                  }}
                />
              </View>
              <View>
                <Text style={Style.fl_name_view_text}>
                  <FontAwesome name="user-circle-o" /> Last name
                </Text>
                <TextInput
                  value={last_name}
                  selectionColor="black"
                  style={Style.fl_name_view_input}
                  onChangeText={e => {
                    lastFlagCheck(e);
                  }}
                />
              </View>
            </View>
            <View style={Style.email_view}>
              <Text style={Style.email_view_text}>
                <MaterialCommunityIcons name="email-outline" /> Email
              </Text>
              <TextInput
                value={email}
                selectionColor="black"
                style={Style.email_view_textinput}
                onChangeText={setEmail}
              />
            </View>
            <View style={Style.email_view}>
              <Text style={Style.email_view_text}>
                <AntDesign name="user" /> Username
              </Text>
              <TextInput
                value={username}
                selectionColor="black"
                style={Style.email_view_textinput}
              
                onChangeText={e => {
                  usernameFlagCheck(e);
                }}
              />
            </View>
            {/* <View style={Style.email_view}>
            <Text style={Style.email_view_text}><AntDesign name='phone'/>  Mobile #</Text>
            <TextInput value={mobile} selectionColor="black" keyboardType='numeric' style={Style.email_view_textinput} onChangeText={setMobile}/>
          </View> */}
            <View>
              <Text style={Style.email_view_text}>
                <MaterialCommunityIcons name="lock-outline" /> Password
              </Text>
              <TextInput
                value={password}
                selectionColor="black"
                style={Style.email_view_textinput}
                secureTextEntry={true}
                onChangeText={setPswd}
              />
            </View>
            <View>
              <Text style={Style.email_view_text}>
                <MaterialCommunityIcons name="lock-outline" /> Confirm password
              </Text>
              <TextInput
                value={confirmPswd}
                selectionColor="black"
                style={Style.email_view_textinput}
                secureTextEntry={true}
                onChangeText={setConfirmPswd}
              />
            </View>
            <TouchableOpacity style={Style.signup_btn} onPress={handlePress}>            
              {loadings ? (
                <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text style={Style.signup_btn_text}>Sign up</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.log_in_btn}
              onPress={() => navigation.navigate('Login')}>
              <Text style={Style.log_in_btn_text}>Log in instead</Text>
            </TouchableOpacity>
            <View style={Style.auth_view}>
              {/* <AntDesign
                style={Style.auth_icon}
                name="google"
                onPress={Gmail_auth}
              />
              <FontAwesome5Pro
                style={Style.auth_icon}
                name="facebook"
                onPress={Facebook_auth}
              /> */}
            </View> 
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const Style = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5A56E9',
  },
  dot1: {
    backgroundColor: '#f5ae62',
    opacity: 0.7,
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    top: '-5%',
    right: '8%',
  },
  dot2: {
    borderWidth: 4,
    borderColor: 'rgba(158, 150, 150, .3)',
    width: 18,
    height: 18,
    borderRadius: 1000,
    position: 'absolute',
    top: '2%',
    left: '25%',
  },
  e_container: {
    width: '100%',
    height: '25%',
    justifyContent: 'center',
  },
  e_container2: {
    width: '70%',
    alignSelf: 'center',
  },
  e_container2_text1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 35,
    letterSpacing: 1,
  },
  e_container2_text2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 35,
    lineHeight: 35,
    letterSpacing: 2,
  },
  dot3: {
    borderWidth: 4,
    borderColor: 'rgba(158, 150, 150, .3)',
    width: 25,
    height: 25,
    borderRadius: 1000,
    position: 'absolute',
    top: '18%',
    right: '15%',
  },
  log_container: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    justifyContent: 'center',
  },
  log_container2: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
  },
  fl_name_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fl_name_view_text: {
    color: 'gray',
    fontSize: 16,
    marginTop: '3%',
  },
  fl_name_view_input: {
    height: 25,
    width: 130,
    padding: 5,
    borderBottomWidth: 1,
    color: 'black',
  },
  log_container2_text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: '4%',
  },
  email_view: {},
  email_view_text: {
    color: 'gray',
    fontSize: 16,
    marginTop: '5%',
  },
  email_view_textinput: {
    height: 28,
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    color: 'black',
  },
  forgot_btn: {
    width: '40%',
    marginTop: '3%',
  },
  forgot_btn_text: {
    color: '#5A56E9',
    fontWeight: 'bold',
  },
  signup_btn: {
    width: '80%',
    height: 50,
    backgroundColor: '#5A56E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '3%',
  },
  signup_btn_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:20
  },
  log_in_btn: {
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '3%',
  },
  log_in_btn_text: {
    color: '#5A56E9',
    fontWeight: 'bold',
  },
  auth_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '25%',
    alignSelf: 'center',
    marginTop: '3%',
  },
  auth_icon: {
    fontSize: 30,
    color: '#5A56E9',
  },
});

export default Sign_up;
