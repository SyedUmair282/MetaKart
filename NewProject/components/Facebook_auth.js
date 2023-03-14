import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Alert } from 'react-native';

const Facebook_auth = async(authdata,setAuthdata,setDisable) => {
    try {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        
        if (result.isCancelled) {
        throw 'User cancelled the login process';
    }
    
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    
    if (!data) {
        throw 'Something went wrong obtaining access token';
    }
    
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    
    // Sign-in the user with the credential
    const user= auth().signInWithCredential(facebookCredential);
    user.then((user)=>{
        console.log("Facebook user data is====>",user);
        if(user){
            let obj={
              username:user.additionalUserInfo.profile.name,
              password:null,
              first_name:user.additionalUserInfo.profile.first_name,
              last_name:user.additionalUserInfo.profile.last_name,
              email:user.additionalUserInfo.profile.email,
              isVerified:true,
              phone:user.user.phoneNumber,
              vendor_id:null
            }
            setAuthdata([...authdata,obj])
            setDisable(false)
        }
    })
  .catch((error)=>{console.log("Something went wrong",error);});
} catch (error) {
    console.log("error is==>",error);
    if(error=="User cancelled the login process"){
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
    setDisable(false)
    // else{
    //     Alert.alert(
    //         "Error",
    //         "Something went wrong",
    //         [
    //       {
    //         text: "Ok",
    //         onPress: () => {setDisable(false)},
    //       }
    //     ]
    //   );
    // }
    }
}

export default Facebook_auth;