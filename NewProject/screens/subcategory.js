import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ToastAndroid
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Tabs from '../components/tabs';
import {NativeBaseProvider} from 'native-base';
import SkeletonJs from '../components/Skeleton';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import No_Item from '../image/no.png';
import axios from 'axios';



const Subcategory = ({navigation, route}) => {
  const [products, setProducts] = useState([]);
  const {hierarchy_id, cat_name} = route.params;
  const [limit, setlimit] = useState(6);
  const [isLoading, setIsloading] = useState(true);
  const [id, setId] = useState();
  //const [heading, setHeading] = useState('All');
  console.log("hier id",hierarchy_id)

  const [overlay,setOverlay]=useState(false);
  const [disable,setDisable]=useState(false);

  const getdata = async () => {
    setIsloading(true)
    
      setProducts([]);
      await axios.post(
        `http://192.168.1.9:5000/sql/getMainSpecificCategoryAllProducts`, {hierarchy_id}
      )
        .then(response => {response.data
          if(response.data){
            setProducts(response.data);
            console.log('chekcing',response.data);
            setIsloading(false);
          }
          else{
            setIsloading(false)
          }})
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
     
    // } else {
    //   setProducts([]);
    //   await fetch(
    //     `http://192.168.1.9:5000/sql/subCategoryProducts/${limit}/${id}`,
    //   )
    //     .then(response => response.json())
    //     .then(json => {
    //       if(json.length > 0){
    //         setProducts(json);
    //         setIsloading(false)
    //       }
    //       else{
    //         setIsloading(false)
    //       }
    //       console.log('chekcing',json.length);
    //       console.log('check product',products);
    //     })
    //     .catch(error => {
    //       console.error(error);
    //       if(error=="TypeError: Network request failed"){
    //         ToastAndroid.showWithGravityAndOffset(  
    //           "No network connectivity",  
    //           ToastAndroid.LONG,
    //           ToastAndroid.BOTTOM,
    //           25,
    //           50 
    //         ); 
    //       }
    //     });
    // }
  };

  useEffect(() => {
    getdata();
  }, [limit]);


  const flatlistEnd = () => {
    return isLoading ? (
      <NativeBaseProvider>
        <View style={{marginBottom: '35%'}}>
          <SkeletonJs />
        </View>
      </NativeBaseProvider>
    ) : null;
  };

  const addToCart = async productData => {
    // try {
    //   let asyncData = await AsyncStorage.getItem('@cartItems');
    //   asyncData = JSON.parse(asyncData);
    //   if (asyncData) {
    //     let cartItem = asyncData;
    //     cartItem.push(productData);
    //     await AsyncStorage.setItem('@cartItems', JSON.stringify(cartItem));
    //   }
    //   else {
    //     let cartItem = [];
    //     cartItem.push(productData);
    //     await AsyncStorage.setItem('@cartItems', JSON.stringify(cartItem));
    //   }
    // } catch (error) {
    //   alert('Something went wrong');
    // }
    console.log('hello');
  };

  const renderItem = element => {
    const productDetail = {
      product_id: element.item.product_id,
      name: element.item.name,
      price: element.item.price,
      image: element.item.imgs,
    };

    return (
      <View style={Style.all_item_main2}>
        <TouchableOpacity disabled={disable} style={Style.all_item_main3} activeOpacity={0.8} onPress={() => {
          
          setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigation.navigate('Product_detail', element.item)
                setOverlay(false)
                setDisable(false)
              }, 1000);
          }}>
          <View
            style={Style.all_item_main4}
            >
            <Image
              style={Style.all_item_main4_img}
              resizeMode="cover"
              source={{
                uri: element.item.imgs,
              }}
            />
          </View>
          <View>
            <Text style={Style.cardTitle}>
              {element.item.name.split(/\s+/).slice(0, 4).join(' ') + '...'}
            </Text>
            <View style={Style.cardBotm}>
              <Text style={Style.cardPrice}>RS. {element.item.price}</Text>
              <Text style={Style.rating}>
                4.5 <Icon style={Style.ratingIcon} name="md-star-half-sharp" />
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity
            onPress={() => addToCart(productDetail)}
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderWidth: 1,
              elevation: 2,
              height: 35,
              borderRadius: 22,
              marginBottom: 4,
            }}>
            <FontAwesome name="heart-o" style={Style.middle2_2_icon} />
          </TouchableOpacity> */}

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
    );
  };
  const onEndReached = () => {
    if (products.length !== products.length) {
      setlimit(limit + 4);
      //setIsloading(false);
    }
    setIsloading(false);
  };
  return (
    <View>
      <View style={Style.head_main}>
      <Spinner
      visible={overlay}
    />
        <View>
          <AntDesign
            name="arrowleft"
            style={Style.head_icon}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={Style.head_text_view}>
          <Text style={Style.head_text}>{cat_name}</Text>
          <FontAwesome5 name='search' style={Style.searchIcon} onPress={() => navigation.navigate('Search')}/>
        </View>
      </View>

      <View style={Style.all_item_main}>
        <FlatList
          ListHeaderComponent={
            <View style={{backgroundColor:"white"}}>
              <Tabs hierarchy_id={hierarchy_id} navigation={navigation} />
              {/* <View style={Style.middle2_1}>
                <Text style={Style.middle2_1_text1}>{heading}</Text>
              </View> */}
            </View>
          }
          ListEmptyComponent={()=>{
            return(
              <View>
                {isLoading===false&&(
                  <View style={{marginTop:"20%",height:230,justifyContent:"center",alignItems:"center",width:"100%",zIndex:999}}>
                    <Image
              style={{height:200,width:220}}
              source={No_Item}
            />
            <Text style={{color:"gray"}}>No Items</Text>
                  </View>
                )
                }
              </View>
            )
          }}
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.product_id}
          numColumns={2}
          ListFooterComponent={flatlistEnd}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          stickyHeaderIndices={[0]}
          style={{backgroundColor:"white"}}
        />
      </View>
    </View>
  );
};

export default Subcategory;

const Style = StyleSheet.create({
  main: {
    width: '100%',
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
  middle2_1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '3.5%',
  },
  middle2_1_text1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1621',
  },
  all_item_main: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    height: '100%',
    marginBottom: -110,
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
  cardTitle: {
    margin: 2,
    marginVertical:'3%',
    paddingHorizontal:'3%',
    color: 'black',
    fontSize: 13,
    zIndex:-997,
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
    alignItems: "center",
    width:'95%'
  },
  searchIcon: {

    color: "#EAE9FC",
    fontSize: 20,

}
});
