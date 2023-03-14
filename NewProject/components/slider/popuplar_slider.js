import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ToastAndroid
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import SkeletonJs from '../Skeleton';
import { NativeBaseProvider } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../../redux/FavouritesRedux';
import Spinner from 'react-native-loading-spinner-overlay';

const Popuplar_slider = ({ navigate, popular, setPopular }) => {

  const [products, setProducts] = useState([]);
  const [limit, setlimit] = useState(10);
  const [isLoading, setIsloading] = useState(false);
  const [cardLoader, setCardLoader] = useState(false)


  const [overlay,setOverlay]=useState(false);
  const [disable,setDisable]=useState(false);

  
  const favouriteState = useSelector(state => state.favourite)
  const favArray = favouriteState.favourites;

  const dispatch = useDispatch();


  const getdata = async () => {
    setIsloading(true)
    await fetch(`http://192.168.1.9:5000/sql/popular/${limit}`)
      .then((response) => response.json())
      .then((json) => { setProducts(json) 
        setIsloading(false)})
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
    setPopular(false)
  }, [popular]);



  // const addToFav = (productDetail) => {
  //   try {

  //     // alert("added")
  //     dispatch(addFavourite(productDetail));
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  // const removeFav = (productDetail) => {
  //   try {
  //     // alert("remove")
  //     dispatch(removeFavourite(productDetail));
  //   } catch (error) {
  //     alert(error);
  //   }
  // };


  // const isFavourate = id =>
  //   Boolean(favArray.find(item => item.product_id === id));


  return (
    <View style={Styles.main}>
      <Spinner
          visible={overlay}
        />
      <View style={Styles.middle2}>
        <View style={Styles.middle2_1}>
          <Text style={Styles.middle2_1_text1}>Popular Items</Text>
        </View>
        <TouchableOpacity style={Styles.middle2_2} activeOpacity={0.5} onPress={() => navigate.navigate('SeeAllPopular')}>
          <Text style={Styles.middle2_text1}>See All</Text>
          <Feather name="arrow-right" style={Styles.middle2_2_icon} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ width: '100%', flexDirection: 'row', }}>
          {
            isLoading ? (
              <NativeBaseProvider>
                <View >
                  <SkeletonJs />
                </View>
              </NativeBaseProvider>
            ) : (products?.map((element, key) =>


      
      
      (
        <TouchableOpacity key={key} disabled={disable} activeOpacity={0.7} onPress={() => {
          setDisable(true)
          setOverlay(true)
          setTimeout(() => {
            navigate.navigate('Product_detail', element)
            setOverlay(false)
            setDisable(false)
          }, 1000);
          }}>
            <View style={Styles.ProdCard}>
              <View style={Styles.imgContainer}>
                <Image
                  style={Styles.cardImg}
                  source={{
                    uri: element.imgs,
                  }}></Image>
              </View>
                  <View style={Styles.cardDesc}>
                    {
                      cardLoader ? (
                        <ActivityIndicator size='large' color="black" />
                      ) : (
                        <>
                          <Text style={Styles.cardTitle}>
                            {element.name.split(/\s+/).slice(0, 3).join(" ") + "..."}
                          </Text>
                          <View style={Styles.cardBotm}>
                            <Text style={Styles.cardPrice}>RS.{element.price}</Text>
                            <Text style={Styles.rating}>
                              {element.rating}{' '}
                              <Icon style={Styles.ratingIcon} name="md-star-half-sharp" />
                            </Text>
                          </View>
                        </>
                      )
                    }

                  </View>
              </View>
          </TouchableOpacity>
      )))
    }
        </View>
      </ScrollView >
    </View >
    
  );



};

const Styles = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: "#f7f7f7"
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
    fontSize: 15,
    marginRight: 10,
    color: "gray"
  },
  cardDesc: {
    paddingHorizontal: "4%",
  },
  ProdCard: {
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#555',
    width: 160,
    height: 190,
    marginLeft: 10,
    marginVertical: 5,

    // backgroundColor:'green',
  },
  imgContainer: {
    borderBottomWidth: 1,
    borderColor: '#ACACAC',
    width: '90%',
    alignItems: 'center',
  },
  cardImg: {
    width: 100,
    height: 100,
  },
  cardTitle: {
    fontWeight: '500',
    fontSize: 13,
    flexWrap: 'wrap',
    color: "black",
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
    fontSize: 15
  },
  cardBotm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: "3%",
  },
  favIcon: {
    color: '#5A56E9',
    fontSize: 25,
    fontWeight: '800',
    // marginTop: 1.5,
  },
});

export default Popuplar_slider;
