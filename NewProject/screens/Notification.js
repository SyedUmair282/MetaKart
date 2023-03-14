import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//import PushNotification from "react-native-push-notification";

const arr = [1, 2, 3, 4, 5, 6, 7, 89, 2, 3, 4, 2]

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const Notification = ({ navigation }) => {


  const [refreshing, setRefreshing] = React.useState(false);
  const [notifyShow, setNotifyShow] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


 
  return (
    <View style={styles.all_item_main}>

      <View style={styles.head_main}>
        <View>
          <AntDesign name='arrowleft' style={styles.head_icon} onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.head_text_view}>
          <Text style={styles.head_text}>Notifications</Text>
        </View>
      </View>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

      } showsVerticalScrollIndicator={false}>
        <View style={{ borderBottomWidth: 1, width: "92%", borderColor: "#b3b1b1", alignSelf: "center" }}>
          <Text style={{ color: "gray", fontSize: 16, width: "95%" }}>All</Text>
        </View>
        {arr.map((item, index) => (

          <View style={styles.ParentNotification} key={index}>
            <View style={styles.Notification}>
              <View style={styles.innerLeft}>

                <View style={styles.TextContainer}>
                  <Text style={{ color: "gray", fontWeight: "bold" }}>Your order status has been changed. You can get your order in 3-4 working days</Text>
                  <Text style={{ color: "#c7c6c5", fontSize: 11, marginTop: 5 }}>12 Hours Ago</Text>
                </View>
              </View>
              <View style={styles.NotificationIcons}>
                <AntDesign name='closecircle' color={'red'} style={{ opacity: 0.6 }} size={30} />
              </View>
            </View>
          </View>

        ))}
      </ScrollView>



    </View>

  )
}

export default Notification

const styles = StyleSheet.create({
  all_item_main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f7f7f7",
  },

  head_main: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: "3%",
    backgroundColor: "#5A56E9"
  },
  head_icon: {
    fontSize: 20,
    color: "white"
  },
  head_text_view: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center"
  },
  head_text: {
    fontSize: 19, color: "white", fontWeight: "bold"
  },



  timeElaspe: {
    borderBottomWidth: 2,
    borderColor: '#e5e8e7',
    fontSize: 20,
    width: '92%',
    marginLeft: '4%',
    marginVertical: '2%'
  },
  Recent: {
    fontSize: 15,
    fontWeight: 'bold',
    // paddingTop: "6%",
    // paddingBottom: '1.5%',
    paddingVertical: '1.5%'


  },
  Notification: {

    // borderBottomWidth: 3,
    // borderWidth:1,
    // backgroundColor:'white',
    borderRadius: 10,
    borderColor: 'silver',
    // height: '65%',
    flex: 1,
    // width: '92%',
    paddingTop: -10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,

  },
  ParentNotification: {
    // borderWidth: 2,
    // backgroundColor:"#ffff",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: '3%',
    paddingHorizontal: '2%',
    backgroundColor: 'white',
    width: '95%',
    paddingHorizontal: '2%',
    alignSelf: 'center',
    marginVertical: '1.5%',
    elevation: 3,
    shadowColor: '#aaa',
    borderRadius: 10,
    //  marginBottom:10

  },
  innerLeft: {
    // borderWidth: 1,
    // borderColor: 'green',
    // height: '100%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tinyLogo: {
    width: 50,
    height: 50,

  },
  TextContainer: {


    width: '100%',
    justifyContent: 'center',
    paddingTop: '2%',
    paddingBottom: '2%'

  },
  NotificationIcons: {
    // height: '50%',
    width: '20%',
    // borderColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',

  }

})
