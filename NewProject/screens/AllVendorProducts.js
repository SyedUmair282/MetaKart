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
import Spinner from 'react-native-loading-spinner-overlay';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SkeletonJs from '../components/Skeleton';
import {NativeBaseProvider} from 'native-base';
import SearchBar from '../components/SearchBar';

const AllVendorProducts = ({route}) => {
  const vendorObj = route.params;
  const navigate = useNavigation();
  const [products, setProducts] = useState([]);
  const [limit, setlimit] = useState(20);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const [overlay,setOverlay]=useState(false)
  const [disable,setDisable]=useState(false)

  const getdata = async () => {
    setIsloading(true);
    await fetch(`http://192.168.1.9:5000/sql/venderProduct/${vendorObj.vendorId}/${limit}`)
      .then(response => response.json())
      .then(json => {
        setProducts(json);
        setIsloading(false);
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
    // setIsloading(true);
    // fetch(`http://192.168.1.9:5000/sql/venderProduct/${vendorObj.vendorId}/${limit}`)
    //     .then((response) => response.json())
    //     .then((json) => setProducts(json))
    //     .then(e=>setIsloading(false))
    //     .catch((error) => console.error(error))
    getdata();
  }, [limit]);
  const flatlistEnd = () => {
    return isLoading ? (
      <NativeBaseProvider>
        <View>
          <SkeletonJs />
        </View>
      </NativeBaseProvider>
    ) : null;
  };

  const onEndReached = () => {
    setlimit(limit + 4);
    setIsloading(false);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setProducts([]);
    //setlimit(6);
    getdata()
    setIsRefreshing(false);
  };
  const renderItem = element => {
    return (
      <View style={Style.all_item_main2}>
        <View style={Style.all_item_main3}>
          <TouchableOpacity
            style={Style.all_item_main4}
            disabled={disable}
            onPress={() => {
                setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigate.navigate('Product_detail', element.item)
                setOverlay(false)
                setDisable(false)
              }, 1000);
                }}>
            <View
              style={{
                borderBottomWidth: 1,
                paddingVertical: '3%',
                width: '100%',
                borderBottomColor: '#ACACAC',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={Style.all_item_main4_img}
                resizeMode="cover"
                source={{uri: element.item.imgs}}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={Style.cardTitle}>
              {element.item.name.split(/\s+/).slice(0, 4).join(' ') + '...'}
            </Text>
            <View style={Style.cardBotm}>
              <Text style={Style.cardPrice}>RS. {element.item.price}</Text>
              <Text style={Style.rating}>
                {element.item.rating}{' '}
                <Icon style={Style.ratingIcon} name="md-star-half-sharp" />
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => addToCart(productDetail)} style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderWidth: 1, elevation: 2, height: 35, borderRadius: 22, marginBottom: 4 }}>
                        <FontAwesome name="heart-o" style={Style.middle2_2_icon} />
                    </TouchableOpacity> */}
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
          <View>
            <SearchBar navigate={navigate} />
            <Text style={Style.mainHead}>
              Products for: {vendorObj.vendorName}
            </Text>
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

export default AllVendorProducts;

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
    color: '#C92252',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ACACAC',
    paddingBottom: 8,
  },
  all_item_main4_img: {
    width: '80%',
    height: 120,
  },
  cardTitle: {
    margin: 2,
    marginVertical: '3%',
    paddingHorizontal: '3%',
    color: 'black',
    fontSize: 13,
    zIndex: -997,
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
    marginVertical: '3%',
    paddingLeft: '2%',
    alignItems: 'center',
    width: '95%',
  },
  mainHead: {
    fontSize: 25,
    fontWeight: '900',
    marginVertical: '3%',
    marginHorizontal: '2%',
    color: '#484848',
  },
});
