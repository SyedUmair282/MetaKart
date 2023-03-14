import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'


export async function requestUserPermission(currentUser) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken(currentUser)
  }
}

const GetFCMToken = async (currentUser) => {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken')
  console.log(fcmtoken, 'oldToken')
  if(fcmtoken){
    const payload = {
      user_id: currentUser.user[0].user_id,
      token: fcmtoken
    }
    await axios.post('http://192.168.1.9:5000/sql/updateNotifyToken', payload)
  }


  if (!fcmtoken) {

    try {
      const fcmtoken = await messaging().getToken()
      if (fcmtoken) {
        const payload = {
          user_id: currentUser.user[0].user_id,
          token: fcmtoken
        }
        console.log(fcmtoken, 'newtoken')
        await axios.post('http://192.168.1.9:5000/sql/updateNotifyToken', payload)
        await AsyncStorage.setItem('fcmtoken', fcmtoken);


      }
    } catch (error) {
      console.log(error, 'error in fcm token')
    }
  }


}

export const NotificationListener = () => {

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    })

  messaging().onMessage(async remoteMessage => {
    console.log("Notification on foreground state...", remoteMessage);
  })
}