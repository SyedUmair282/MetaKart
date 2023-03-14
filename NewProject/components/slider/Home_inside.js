import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator,ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SkeletonJs from '../Skeleton'
import SearchBar from '../SearchBar';
import Carousel from '../carousel/carousel';
import { dummyData } from '../../data/Carousel_data'
import Popuplar_slider from './popuplar_slider';
import Categories from '../Categories';
import VendorSlider from '../VendorSlider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch,useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../../redux/FavouritesRedux';
import {requestUserPermission , NotificationListener} from '../../src/utils/pushNotification_helper';
import Spinner from 'react-native-loading-spinner-overlay';

// import PushNotification , {Importance} from "react-native-push-notification";

const Home_inside = ({ navigate }) => {

  const {currentUser} = useSelector(state=>state.user)

  if (currentUser !== null) {
    requestUserPermission(currentUser);
    NotificationListener();
  }
  const [overlay,setOverlay]=useState(false)
  const [disable,setDisable]=useState(false)



  const favouriteState = useSelector(state => state.favourite)
  const favArray=favouriteState.favourites;
  
  const dispatch =useDispatch();

  const [products, setProducts] = useState([]);
  // console.log(products)
  const [limit, setlimit] = useState(6);
  const [toastErr, setToastErr] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [head_comp,setHead_Comp] = useState(false)


  const getdata = async () => {
    setIsloading(true)
    await fetch(`http://192.168.1.9:5000/sql/all/${limit}`)
      .then((response) => response.json())
      .then((json) => { setProducts(json) })
      .catch((error) => {
        if(error=="TypeError: Network request failed"){
          ToastAndroid.showWithGravityAndOffset(  
            "No network connectivity",  
            ToastAndroid.LONG,  
            ToastAndroid.BOTTOM,
            25,
            50 
          ); 
        }
        else{
          ToastAndroid.showWithGravityAndOffset(  
            "Something went wrong",  
            ToastAndroid.LONG,  
            ToastAndroid.BOTTOM,
            25,
            50 
          ); 
        }})
  }

  useEffect(() => {
    getdata()
    // PushNotification.createChannel(
    //   {
    //     channelId: "test1", // (required)
    //     channelName: "My channel", // (required)
    //     channelDescription: "A channel to test your notifications", // (optional) default: undefined.
    //     playSound: false, // (optional) default: true
    //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    //   },
    //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    // );

    // PushNotification.channelExists("test1", function (exists) {
    //   console.log(exists); // true/false
    // });
  }, [limit,toastErr]);


  const flatlistEnd = () => {
    return (
      isLoading ?
        <NativeBaseProvider>
          <View>
            <SkeletonJs />
          </View> 
        </NativeBaseProvider>: null
    );
  }

  // const addToCart = async (productData) => {
  //   try {
  //     let asyncData = await AsyncStorage.getItem('@cartItems');
  //     asyncData = JSON.parse(asyncData);
  //     if (asyncData) {
  //       let cartItem = asyncData;
  //       cartItem.push(productData);
  //       await AsyncStorage.setItem('@cartItems', JSON.stringify(cartItem));
  //     }
  //     else {
  //       let cartItem = [];
  //       cartItem.push(productData);
  //       await AsyncStorage.setItem('@cartItems', JSON.stringify(cartItem));
  //     }
  //   } catch (error) {
  //     alert('Something went wrong');
  //   }
  // }

  // const removeSpecificProduct = async (productData) => {
  //   try {
  //     let asyncData = await AsyncStorage.getItem('@cartItems');
  //     asyncData = JSON.parse(asyncData);
  //     if (asyncData) {
  //       let cartItem = asyncData;
  //       const removedData = cartItem.filter(object => object.product_id != productData.product_id)
  //       console.log("🚀  file: Home_inside.js  line 71  removeSpecificProduct  removedData", removedData)
  //       await AsyncStorage.removeItem('@cartItems')
  //       await AsyncStorage.setItem('@cartItems', JSON.stringify(removedData));
  //     }
  //   } catch (error) {
  //     alert('Something went wrong');
  //   }
  // }


  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('@cartItems')
  //     console.log("🚀  file: Home_inside.js  line 167  getData  jsonValue", jsonValue)
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch (error) {
  //     alert('Something went wrong');
  //   }
  // }




//   const removeValue = async () => {
//     try {
//       await AsyncStorage.removeItem('@cartItems')
//     } catch (e) {
//       // remove error
//     }
//     console.log('Done.')
//   }
// ///==============================================
//   const addToFav = (productDetail) => {
//     try {
      
//       // alert("added")
//       dispatch(addFavourite(productDetail));
//     } catch (error) {
//       alert(error);
//     }
//   };

//   const removeFav = (productDetail) => {
//     try {
//       // alert("remove")
//       dispatch(removeFavourite(productDetail));
//     } catch (error) {
//       alert(error);
//     }
//   };




  const renderItem = (element) => {

    const USER_1 = {
      name: 'Tom',
      age: 20,
      traits: {
        hair: 'black',
        eyes: 'blue'
      }
    }

    const USER_2 = {
      name: 'Sarah',
      age: 21,
      hobby: 'cars',
      traits: {
        eyes: 'green',
      }
    }

    const productDetail = {
      product_id: element.item.product_id,
      name: element.item.name,
      price: element.item.price,
      image: element.item.imgs
    }

    // const isFavourate = id =>
    // Boolean(favArray.find(item => item.product_id === id));

    return (
      <View style={Style.all_item_main2}>
        <View style={Style.all_item_main3}>
          <TouchableOpacity style={Style.all_item_main4} disabled={disable} onPress={() => {
          setDisable(true)
          setOverlay(true)
          setTimeout(() => {
            navigate.navigate('Product_detail', element.item)
            setOverlay(false)
            setDisable(false)
          }, 1000);
          }} activeOpacity={0.7}>
            <View style={{borderBottomWidth: 1, paddingVertical:"3%",width:'100%',borderBottomColor: "#ACACAC" ,alignItems:'center',justifyContent:'center'}}>

            <Image style={Style.all_item_main4_img}
              resizeMode="cover"
              source={{ uri: element.item.imgs }}
              />
              </View>
          <View>
            <Text style={Style.cardTitle}>
              {element.item.name.split(/\s+/).slice(0, 4).join(" ") + "..."}
            </Text>
            <View style={Style.cardBotm}>
              <Text
                style={Style.cardPrice}>
                RS. {element.item.price}
              </Text>
              <Text style={Style.rating}>
                {element.item.rating}{' '}
                <Icon style={Style.ratingIcon} name="md-star-half-sharp" />
              </Text>
            </View>
          </View>


          {/* {isFavourate(element.item.product_id) ? (
            <MaterialCommunityIcons
            name="cards-heart"
            onPress={() => {removeFav(productDetail)}}
            style={Style.middle2_2_icon}
            />
            ) : (
              <MaterialCommunityIcons
              name="cards-heart-outline"
              onPress={() => {addToFav(productDetail)}}
              style={Style.middle2_2_icon}
              />
            )} */}




          {/* {
            favArray.includes(element.item.product_id)?(<TouchableOpacity onPress={() => addToCart(productDetail)} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
            <FontAwesome name="heart" style={Style.middle2_2_icon} />
            </TouchableOpacity>)
          :(<TouchableOpacity onPress={() => addToCart(productDetail)} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
          <FontAwesome name="heart-o" style={Style.middle2_2_icon} />
          </TouchableOpacity>)
        } */}
          

          {/* <TouchableOpacity onPress={getData} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
            <FontAwesome name="get-pocket" style={Style.middle2_2_icon} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={removeValue} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
            <Feather name="delete" style={Style.middle2_2_icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => removeSpecificProduct(productDetail)} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
            <Feather name="home" style={Style.middle2_2_icon} />
          </TouchableOpacity> */}

          {/*<TouchableOpacity onPress={() => storeMergeData(product)} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
          <Feather name="flower" style={Style.middle2_2_icon} />
        </TouchableOpacity> */}

        </TouchableOpacity>
        </View>
      </View>
    )
  }
  const onEndReached = () => {
    setlimit(limit + 4);
    setIsloading(false)
  }

  const onRefresh = () => {
    setIsRefreshing(true);
    setHead_Comp(true);
    //setlimit(4);
    getdata()
    setIsRefreshing(false)
    setToastErr(!toastErr)
  }
  
  return (
    <View style={Style.all_item_main}>
      <Spinner
          visible={overlay}
        />
      <FlatList
      ListHeaderComponent={
        <View style={{flex:1,width:"100%"}}>

          {/* ///?Search Bar============================================== */}
          <SearchBar navigate={navigate} />

          
          {/* //?Slider Carosel============================================== */}
        <Carousel  />

        
          {/* //?Categories buttons============================================== */}
        <Categories navigate={navigate}/>
        <VendorSlider popular={head_comp} setPopular={setHead_Comp}/>
        <Popuplar_slider navigate={navigate} popular={head_comp} setPopular={setHead_Comp}/>
        <View style={Style.middle2}>
        <View style={Style.middle2_1}>
          <Text style={Style.middle2_1_text1}>All Items</Text>
        </View>
        <TouchableOpacity style={Style.middle2_2} activeOpacity={0.6} onPress={()=>navigate.navigate("SeeAllProducts")}>
          <Text style={Style.middle2_text1}>See All</Text>
          <Feather name="arrow-right" style={Style.middle2_2_icon} />
        </TouchableOpacity>
        </View>
        </View>
      }
        data={products} renderItem={renderItem} keyExtractor={item => item.product_id} numColumns={2}  
      ListFooterComponent={flatlistEnd}
      extraData={head_comp}
      onEndReached={onEndReached} onEndReachedThreshold={0.5} refreshing={IsRefreshing} onRefresh={onRefresh}/>
  </View>
  );
};

const Style = StyleSheet.create({
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
    fontSize: 15,
    marginRight: 10,
    color: "gray"
  },
  all_item_main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f7f7f7",
  },
  all_item_main2: {
    width: '50%',
    padding: 4,
    justifyContent: "center",
    zIndex:-997,
    elevation:-998
    
  },
  all_item_main3: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3.5,
    shadowColor: '#555',
    zIndex:-997,
    elevation:3
  },
  all_item_main4: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    zIndex:-997,
    elevation:-998
  },
  all_item_main4_img: {
    width: '80%',
    height: 120,
    zIndex:-997,
    //elevation:-998
  },
  cardTitle: {
    margin: 2,
    marginVertical:'3%',
    color: 'black',
    fontSize: 13,
    zIndex:-997,
    elevation:-998
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
    marginVertical: "3%",
    paddingLeft: "2%",
    alignItems: "center"
  }
});

export default Home_inside;