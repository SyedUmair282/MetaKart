import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import SkeletonJs from '../components/Skeleton';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import empty_cart from '../image/empty_cart.png';
import {NativeBaseProvider} from 'native-base';
import loadingGif from '../assets/fonts/images/loader.gif';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useDispatch, useSelector} from 'react-redux';
import {removeFavourite} from '../redux/FavouritesRedux';
import {getFavouriteDB, remFavouriteDB} from '../redux/apiCalls';
import Spinner from 'react-native-loading-spinner-overlay';
const Favorites = ({navigation}) => {
  const dispatch = useDispatch();

  const favouriteState = useSelector(state => state.favourite);
  const favArray = favouriteState.favourites;
  const {isFetching, error, currentUser, loadings} = useSelector(
    state => state.user,
  );

  const [favRedux, setFavRedux] = useState([]);
  const [FavProducts, setFavProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [login, setLogin] = useState(false);
  const [overlay,setOverlay]=useState(false)
  const [disable,setDisable]=useState(false)

  const getData = async () => {
    try {
      if (currentUser) {
        setLogin(true);
        getFavouriteDB(dispatch, currentUser,navigation);
        setLoader(false);
      } else {
        console.log('No current user');
        setLoader(false);
      }
      // const jsonValue = await fetch('');
      // const result = JSON.parse(jsonValue);
      // setFavProducts(result);
    } catch (error) {
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onEndReached = () => {
    setLoading(false);
  };

  const removeFav = async productDetail => {
    try {
      // console.log("first")
      dispatch(removeFavourite(productDetail));
    } catch (error) {
      alert(error);
    }
  };

  const flatListEnd = () => {
    return isLoading && isLoading ? (
      <NativeBaseProvider>
        <View>
          <SkeletonJs />
        </View>
      </NativeBaseProvider>
    ) : null;
  };

  // const showAlert = (productDetail) =>
  // Alert.alert(
  //   "",
  //   "Remove this item ?",
  //   [
  //     {
  //       text: "Cancel",
  //        onPress: () => Alert.alert("Cancel Pressed"),
  //       style: "cancel",
  //     },{
  //       text: "Remove",
  //       onPress: () => {removeFav(productDetail);Alert.alert("Item Removed")},
  //       style: "default",
  //     },
  //   ],
  //   {
  //     cancelable: true,
  //     onDismiss: () =>{}
  // Alert.alert(
  //   "This alert was dismissed by tapping outside of the alert dialog."
  // )
  //       ,
  //   }
  // );
  console.log("fav data",favArray)

  const renderItem = ({item}) => {
    const productDetail = {
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.imgs,
      user_id:currentUser?.user[0].user_id,
      token:currentUser?.token,
      setDisable,
      setOverlay
    };

    return (
      <>
        {item.is_deleted === false ? (
          <View style={Style.all_item_main2}>
            <View style={Style.all_item_main3}>
              <TouchableOpacity
              disabled={disable}
                style={Style.all_item_main4}
                onPress={() => {
                  setDisable(true)
                  setOverlay(true)
                  setTimeout(() => {
                    navigation.navigate('Product_detail', item)
                    setOverlay(false)
                    setDisable(false)
                  }, 1000);
                  }}>
                {item.discount > 0 ? (
                  <View>
                    <Text style={Style.discount}>{item.discount}%</Text>
                  </View>
                ) : null}
                <Image
                  style={Style.all_item_main4_img}
                  resizeMode="cover"
                  source={{uri: item.imgs}}
                />
              </TouchableOpacity>
              <View>
                <Text style={Style.cardTitle}>
                  {item.name.split(/\s+/).slice(0, 4).join(' ') + '...'}
                </Text>
                <View style={Style.cardBotm}>
                  <Text style={Style.cardPrice}>Rs.{item.price}</Text>
                  <Text style={Style.rating}>
                    {item.numberOfRatings}{' '}
                    <Icon style={Style.ratingIcon} name="md-star-half-sharp" />
                  </Text>
                </View>
              </View>

              <TouchableOpacity>
                {/* <Feather name="home" style={Style.middle2_2_icon} /> */}
                <MaterialCommunityIcons
                  name="delete-alert-outline"
                  style={Style.middle2_2_icon}
                  disabled={disable}
                  onPress={() => {
                    if(currentUser){
                      setOverlay(true)
                      setDisable(true)
                      remFavouriteDB(dispatch, productDetail,setOverlay,setDisable);
                    }
                    else{
                      Alert.alert(
                        "Attention",
                        "Your session is expired. Please login again",
                        [
                      {
                        text: "Ok",
                        onPress:() => {
                        navigation.navigate('Profile')
                    },
                      }
                    ]
                    );
                    }
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null
        //  <View style={Style.main_imgIs}>
        //   <Image style={Style.all_item_main4_imgIs} source={empty_cart} />
        // <Text style={{color: 'gray', fontWeight: '400',top:50,}}>
        //   No Favourites Items
        //   </Text>
        // </View>
        }
      </>
    );
  };

  return (
    <View style={Style.all_item_main}>
      <View style={Style.head_main}>
        <View>
          <AntDesign
            name="arrowleft"
            style={Style.head_icon}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={Style.head_text_view}>
          <Text style={Style.head_text}>Favorites items</Text>
        </View>
      </View>
      <Spinner
          visible={overlay}
        />
      {login ? (
        loader ? (
          <View style={Style.imgView}>
            <Image style={Style.imgStyleGif} source={loadingGif}></Image>
          </View>
        ) : favArray && favArray.length > 0 ? (
          <FlatList
            ListHeaderComponent={<View></View>}
            data={favArray}
            keyExtractor={item => item.product_id}
            numColumns={2}
            renderItem={renderItem}
            onEndReached={onEndReached}
            ListFooterComponent={flatListEnd}
          />
        ) : (
          <View style={Style.main_img}>
            <Image style={{width: '70%', height: '35%'}} source={empty_cart} />
            <Text style={{color: 'gray', fontWeight: '400'}}>
              No Favourite Items
            </Text>
          </View>
        )
      ) : loader ? (
        <View style={Style.imgView}>
          <Image style={Style.imgStyleGif} source={loadingGif}></Image>
        </View>
      ) : (
        
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20, color: 'black', marginVertical: '5%'}}>
            Please login to continue
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}
            style={{
              alignItems: 'center',
              padding: '3%',
              width: '50%',
              backgroundColor: '#5A56E9',
              borderRadius: 5,
            }}>
            <Text style={{fontSize: 20, color: '#fff'}}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Style = StyleSheet.create({
  discount: {
    padding: 2,
    marginLeft: -5,
    marginTop: -5,
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#fff',
    position: 'relative',
    left: -60,
    top: 5,
    zIndex: 5,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: 15,
    width: 50,
  },
  middle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  middle2_1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  middle2_1_text1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1621',
  },
  middle2_1_text2: {
    fontSize: 14,
    fontWeight: '200',
    color: 'black',
    opacity: 0.3,
    marginLeft: 10,
  },
  middle2_text1: {
    color: 'gray',
    marginRight: 1,
    letterSpacing: 1,
  },
  middle2_2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  middle2_2_icon: {
    fontSize: 30,
    alignSelf: 'center',
    // marginRight: 10,
    color: '#5A56E9',
  },
  all_item_main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  all_item_main2: {
    width: '50%',
    padding: 4,
    justifyContent: 'center',
  },
  all_item_main3: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3.5,
    shadowColor: '#52006A',
  },
  all_item_main4: {
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ACACAC',
    paddingBottom: 8,
  },
  all_item_main4_img: {
    width: '80%',
    height: 120,
  },
  all_item_main4_imgIs: {
    top: 50,
    width: '90%',
    height: 300,
  },
  cardTitle: {
    margin: 2,
    color: 'black',
    fontSize: 13,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8480C3',
  },
  ratingIcon: {
    color: '#FFCC4C',
    fontSize: 13,
  },
  rating: {
    color: '#E3A500',
    fontSize: 12,
  },
  cardBotm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '5%',
    paddingLeft: '2%',
    alignItems: 'center',
  },
  main_img: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main_imgIs: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
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
  imgStyleGif: {
    width: 50,
    height: 50,
  },
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
});

export default Favorites;
