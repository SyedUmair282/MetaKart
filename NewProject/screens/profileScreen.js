import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {Logout, loginStart} from '../redux/LoginRedux';
import axios from 'axios';

const ProfileScreen = ({navigation}) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState([]);
  const [disable, setDisable] = useState(false);
  const {isFetching, error, currentUser, loadings} = useSelector(
    state => state.user,
  );
  const dispatch = useDispatch();

  const getData = () => {
    if (currentUser) {
      setUser(currentUser.user);
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const back = () => {
    //console.log("Pressss");
    navigation.navigate('Favourites');
    //BackHandler.exitApp()
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => BackHandler.removeEventListener('hardwareBackPress', back);
  }, []);

  return (
    <>
      <View style={styles.head_main}>
        <View>
          <AntDesign
            name="arrowleft"
            style={styles.head_icon}
            onPress={() => {
              navigation.navigate('Home');
              //BackHandler.addEventListener('hardwareBackPress',()=>back())
            }}
          />
        </View>
        <View style={styles.head_text_view}>
          <Text style={styles.head_text}>My Account</Text>
        </View>
      </View>
      {login ? (
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '100%',
          }}>
          <View style={styles.profileCard}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              onPress={() => {
                console.log('pressed');
              }}
              style={styles.editIcon}
            />

            <Text style={styles.userName}>
              {user[0].first_name} {user[0].last_name}
            </Text>
            <Text style={styles.userEmail}>{user[0].email}</Text>
            <Text style={styles.userEmail}>{user[0].phone}</Text>
            <TouchableOpacity
              disabled={disable}
              activeOpacity={0.9}
              style={{
                marginVertical: '2%',
                width: '30%',
                backgroundColor: '#5A56E9',
                borderRadius: 10,
                alignSelf: 'center',
                padding: '2%',
                alignItems: 'center',
              }}
              onPress={async () => {
                console.log('logout');
                dispatch(loginStart());
                try {
                  setDisable(true);
                  const res = await axios.post(
                    'http://192.168.1.9:5000/sql/logout',
                    {user_id: currentUser.user[0].user_id},
                    {
                      headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                      },
                    },
                  );
                  console.log('log res==>', res.data);
                  dispatch(Logout());
                  navigation.navigate('TabNav');
                  setDisable(false);
                } catch (error) {
                  Alert.alert('Logout failed', 'Something went wrong', [
                    {
                      text: 'Ok',
                      onPress: () => console.log('Ok'),
                    },
                  ]);
                }
              }}>
              {loadings === true ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{
                    color: '#ffff',
                    fontWeight: 'bold',
                  }}>
                  Logout
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{width:"100%"}}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Orders');
                }}>
                <View style={styles.profileButton}>
                  <View style={{width: '90%', flexDirection: 'row'}}>
                    <Text style={styles.cardText}>
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        style={styles.buttonIcon}
                      />
                      {'  '}
                      My Orders
                    </Text>
                    <View style={{marginTop: '2%'}}>
                      <Entypo
                        name="chevron-right"
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginRight: '5%',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Favourites');
                }}>
                <View style={styles.profileButton}>
                  <View style={{width: '90%', flexDirection: 'row'}}>
                    <Text style={styles.cardText}>
                      <MaterialCommunityIcons
                        name="heart-outline"
                        style={styles.buttonIcon}
                      />
                      {'  '}
                      Favourites
                    </Text>
                    <View style={{marginTop: '2%'}}>
                      <Entypo
                        name="chevron-right"
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginRight: '5%',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('AddToCart');
                }}>
                <View style={styles.profileButton}>
                  <View style={{width: '90%', flexDirection: 'row'}}>
                    <Text style={styles.cardText}>
                      <Ionicons name="cart-outline" style={styles.buttonIcon} />
                      {'  '}
                      My Cart
                    </Text>
                    <View style={{marginTop: '2%'}}>
                      <Entypo
                        name="chevron-right"
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginRight: '5%',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Aboutus');
                }}>
                <View style={styles.profileButton}>
                  <View style={{width: '90%',flexDirection: 'row'}}>
                    <Text style={styles.cardText}>
                      <Entypo name="info-with-circle" style={styles.buttonIcon} />
                      {'  '}
                      About
                    </Text>
                    <View style={{marginTop: '2%'}}>
                      <Entypo
                        name="chevron-right"
                        style={{
                          fontSize: 20,
                          color: 'black',
                          marginRight: '5%',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: '100%',
          }}>
          <View style={styles.profileCard}>
            <Text style={styles.userNameDisable}>
              Login to access order details, purchase history and more
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{marginVertical: '2%', width: '20%'}}
              onPress={() => {
                //console.log('login');
                navigation.navigate('Login');
              }}>
              <Text
                style={{
                  color: '#ffff',
                  backgroundColor: '#5A56E9',
                  borderRadius: 5,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  padding: '10%',
                  width: '100%',
                  textAlign: 'center',
                }}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{alignItems: 'center', width: '100%'}}>
              <TouchableOpacity
                disabled={true}
                activeOpacity={0.9}
                style={{width: '100%'}}>
                <View style={styles.profileButton}>
                  <View>
                    <Text style={styles.cardTextDisable}>
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        style={styles.buttonIconDisable}
                      />
                      {'  '}
                      My orders
                    </Text>
                  </View>
                  <View style={{marginTop: '2%'}}>
                    <Entypo
                      name="chevron-right"
                      style={{
                        fontSize: 20,
                        color: '#bdbcc4',
                        marginRight: '5%',
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                activeOpacity={0.9}
                style={{width: '100%'}}>
                <View style={styles.profileButton}>
                  <View>
                    <Text style={styles.cardTextDisable}>
                      <MaterialCommunityIcons
                        name="heart-outline"
                        style={styles.buttonIconDisable}
                      />
                      {'  '}
                      Favourites
                    </Text>
                  </View>
                  <View style={{marginTop: '2%'}}>
                    <Entypo
                      name="chevron-right"
                      style={{
                        fontSize: 20,
                        color: '#bdbcc4',
                        marginRight: '5%',
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={true}
                activeOpacity={0.9}
                style={{width: '100%'}}>
                <View style={styles.profileButton}>
                  <View>
                    <Text style={styles.cardTextDisable}>
                      <Ionicons
                        name="cart-outline"
                        style={styles.buttonIconDisable}
                      />
                      {'  '}
                      My Cart
                    </Text>
                  </View>
                  <View style={{marginTop: '2%'}}>
                    <Entypo
                      name="chevron-right"
                      style={{
                        fontSize: 20,
                        color: '#bdbcc4',
                        marginRight: '5%',
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Aboutus');
                }}>
                <View style={styles.profileButton}>
                  <View>
                    <Text style={styles.cardText}>
                      <Entypo name="info-with-circle" style={styles.buttonIcon} />
                      {'  '}
                      About
                    </Text>
                  </View>
                  <View style={{marginTop: '2%'}}>
                    <Entypo
                      name="chevron-right"
                      style={{fontSize: 20, color: 'black', marginRight: '5%'}}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  head_main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: '3%',
    backgroundColor: '#5A56E9',
  },
  head_icon: {
    fontSize: 20,
    color: 'white',
  },
  head_text_view: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  head_text: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 35,
    color: '#5A56E9',
    position: 'absolute',
    zIndex: 999,
    top: '2%',
    left: '5%',
    // backgroundColor:'pink'
  },
  editIcon: {
    fontSize: 35,
    color: 'black',
    position: 'absolute',
    zIndex: 999,
    top: '3%',
    right: '4%',
    // backgroundColor:'pink'
  },
  buttonIcon: {
    fontSize: 17,
    color: 'black',
  },
  buttonIconDisable: {
    fontSize: 17,
    color: '#bdbcc4',
  },
  profileCard: {
    width: '100%',
    height: '28%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  profileButton: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: '3%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    color: 'black',
    width: '100%',
    fontWeight: 'bold',
  },
  cardTextDisable: {
    fontSize: 18,
    color: '#bdbcc4',
    width: '100%',
    fontWeight: 'bold',
  },
  logo: {
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 22,
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  userNameDisable: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%',
  },
  userEmail: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
    // fontWeight:'bold',
  },
});

export default ProfileScreen;
