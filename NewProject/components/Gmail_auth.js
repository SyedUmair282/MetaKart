import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';




const Gmail_auth = async (authdata,setAuthdata,setDisable) => {
  try {
    GoogleSignin.configure({
        webClientId: '377406759720-7sipomkha2hii8urd0gnqq2mle4q92mr.apps.googleusercontent.com',
    });

    // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const user_data=auth().signInWithCredential(googleCredential);
  user_data.then((user)=>{
    console.log("Gmail user data is====>",user);
    if(user){
      let obj={
        username:user.user.displayName,
        password:null,
        first_name:user.additionalUserInfo.profile.given_name,
        last_name:user.additionalUserInfo.profile.family_name,
        email:user.additionalUserInfo.profile.email,
        isVerified:user.additionalUserInfo.profile.email_verified,
        phone:user.user.phoneNumber,
        vendor_id:null
      }
      setAuthdata([...authdata,obj])
      setDisable(false)
    }
    setDisable(false)
  })
  .catch((error)=>{
    //setDisable(false);
    console.log("Something went wrong from google mail",error);
    if(error=="Error: [auth/network-request-failed] A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
      Alert.alert(
                "Network Error",
                "Please check your network connection.",
                [
              {
                text: "Ok",
                onPress: () => {setDisable(false)},
              }
            ]
          );
    }
    setDisable(false);
  
  })
} catch (error) {
    console.log("some google error",error)
    if(error=="Error: NETWORK_ERROR"){
           Alert.alert(
          "Network Error",
          "Please check your network connection.",
          [
        {
          text: "Ok",
          onPress: () => {setDisable(false)},
        }
      ]
    );
    }
    setDisable(false);
}
}

export {
  Gmail_auth
};