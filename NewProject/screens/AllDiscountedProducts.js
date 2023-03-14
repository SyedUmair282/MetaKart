import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonJs from '../components/Skeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeBaseProvider} from 'native-base';
import SearchBar from '../components/SearchBar';
import Spinner from 'react-native-loading-spinner-overlay';
import {addFavourite, removeFavourite} from '../redux/FavouritesRedux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AllDiscountedProducts = () => {
  const favouriteState = useSelector(state => state.favourite);
  const favArray = favouriteState.favourites;
  const navigate = useNavigation();
  const [products, setProducts] = useState([]);
  const [limit, setlimit] = useState(20);
  const [isLoading, setIsloading] = useState(false);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [overlay,setOverlay]=useState(false)
  const [disable,setDisable]=useState(false)
  const dispatch = useDispatch();

  const getDisdata = async () => {
     setIsloading(true);
    await fetch(`http://192.168.1.9:5000/sql/allDiscountProducts/${limit}`)
      .then(response => response.json())
      .then(json => {
        setProducts(json);
        setIsloading(false)
      })
      .catch(error => {
        console.error(error)
        if(error=="TypeError: Network request failed"){
          ToastAndroid.showWithGravityAndOffset(  
            "No network connectivity",  
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50 
          ); 
        }
      });
  };

  useEffect(() => {
    getDisdata();
  }, [limit]);

  const onEndReached = () => {
    setlimit(limit + 8);
    setIsloading(false);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setProducts([]);
    //setlimit(6);
    getDisdata()
    setIsRefreshing(false);
  };

  const flatlistEnd = () => {
    return isLoading ? (
      <NativeBaseProvider>
        <View>
          <SkeletonJs />
        </View>
      </NativeBaseProvider>
    ) : null;
  };

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('@cartItems');
  //     const result = JSON.parse(jsonValue);
  //     setAsynData(result);

  //   } catch (error) {
  //     alert('Something went wrong[[[[[[[[[[[[[[[');
  //   }
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  // const addToFav = async productDetail => {
  //   try {
  //     dispatch(addFavourite(productDetail));
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  // const removeFav = async productDetail => {
  //   try {

  //     dispatch(removeFavourite(productDetail));
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  const renderItem = element => {
    const productDetail = {
      product_id: element.item.product_id,
      name: element.item.name,
      price: element.item.price,
      image: element.item.imgs,
      discount: element.item.discount_percent,
    };

    const isFavourate = id =>
      Boolean(favArray.find(item => item.product_id === id));

    return (
      <View style={Style.all_item_main2}>
        <View style={Style.all_item_main3}>
          <TouchableOpacity
          disabled={disable}
          activeOpacity={0.7}
            style={Style.all_item_main4}
            onPress={() => {
              setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigate.navigate('Product_detail', element.item)
                setOverlay(false)
                setDisable(false)
              }, 1000);
              }}>
            <View>
              <Text style={Style.discount}>
                {element.item.discount_percent * 100}%
              </Text>
            </View>

            {/* {isFavourate(element.item.product_id) ? (
              <MaterialCommunityIcons
                name="cards-heart"
                onPress={() => {removeFav(productDetail);}}
                style={Style.middle2_2_icon}
              />
            ) : (
              <MaterialCommunityIcons
                name="cards-heart-outline"
                onPress={() => {addToFav(productDetail);}}
                style={Style.middle2_2_icon}
              />
            )} */}

            <Image
              style={Style.all_item_main4_img}
              resizeMode="cover"
              source={{uri: element.item.imgs}}
            />
            <View>
              <Text style={Style.cardTitle}>
                {element.item.name.split(/\s+/).slice(0, 4).join(' ') + '...'}
              </Text>
              <View style={Style.cardBotm}>


                <View >
                  <Text style={Style.cardPrice}>RS. {element.item.price}</Text>
                </View>

                <View // style={Style.fav_icon_box}
                >
                  <Text style={Style.rating}>
                    4.5{' '}
                    <Icon style={Style.ratingIcon} name="md-star-half-sharp" />
                  </Text>
                </View>


              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={Style.all_item_main}>
      <Spinner
          visible={overlay}
        />
      <FlatList
        ListHeaderComponent={
          <View >
            <View style={Style.head_main}>
              <View>
                <AntDesign
                  name="arrowleft"
                  style={Style.head_icon}
                  onPress={() => navigate.goBack()}
                />
              </View>
              <View style={Style.head_text_view}>
                <Text style={Style.head_text}>All Discounts</Text>
                <FontAwesome5 name='search' style={Style.searchIcon} onPress={() => navigate.navigate('Search')} />
              </View>
            </View>
          </View>
        }
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.product_id}
        numColumns={2}
        ListFooterComponent={flatlistEnd}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        refreshing={IsRefreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default AllDiscountedProducts;

const Style = StyleSheet.create({
  fav_icon_box: {
    // backgroundColor:'pink',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  discount: {
    padding: 2,
    marginLeft: -5,
    marginTop: -5,
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#fff',
    position: 'relative',
    left: 5,
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
    // backgroundColor:'pink',
    position: 'relative',
    left: '81%',
    top: '-10%',
    zIndex: 6,
    margin: 2,
    fontSize: 28,
    marginRight: 10,
    color: '#5A56E9',
    fontWeight: 'bold',
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
    borderBottomWidth: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderBottomColor: '#ACACAC',
    paddingBottom: 8,
    //backgroundColor:'green'
  },
  all_item_main4_img: {
    width: '90%',
    height: 120,
    marginLeft: 10,
  },
  cardTitle: {
    margin: 1,
    color: 'black',
    fontSize: 15,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5A56E9',
  },
  ratingIcon: {
    color: '#FFCC4C',
    fontSize: 15,
  },
  rating: {
    color: '#E3A500',
    fontSize: 15,
  },
  cardBotm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '2%',
    paddingLeft: '1%',
    alignItems: 'center',
  },
  mainHead: {
    fontSize: 25,
    fontWeight: '900',
    marginVertical: '3%',
    marginHorizontal: '2%',
    color: '#484848',
  },
  head_main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: '3%',
    backgroundColor: '#5A56E9',
  },
  head_text_view: {
    width: '88%',
    justifyContent: 'center',
    marginHorizontal: '5%',
    flexDirection:'row',
    alignItems:'baseline',
    justifyContent:'space-between',
  },
  head_text: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  head_icon: {
    fontSize: 20,
    color: 'white',
  },
  searchIcon: {
    color: "#EAE9FC",
    fontSize: 20,
}
});
