import {View, Text, StyleSheet, Image, FlatList, ActivityIndicator,TouchableOpacity,Alert,ToastAndroid} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import noOrder from '../assets/fonts/images/noOrder.png';
import loaderGif from '../assets/fonts/images/loader.gif';
import { NativeBaseProvider,Skeleton } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from '../redux/LoginRedux';
import axios from 'axios';


const Orders = ({navigation}) => {
  const [OrdProducts, setOrdProducts] = useState([]);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [reload, setReload] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [limit, setlimit] = useState(6);
  const [login,setLogin]=useState(false)
  const {isFetching, error, currentUser, loadings} = useSelector(
    state => state.user,
  );
  const dispatch=useDispatch()

  const onRefresh = () => {
    setIsRefreshing(true);  
    setOrdProducts([])
    setReload(true)
    setIsRefreshing(false)
  }
  const flatListEnd = () => {
    return (
     isLoading && isLoading ?
      // <NativeBaseProvider>
      //   <View style={{width:"100%",height:"100%",backgroundColor:"white",borderWidth:1}}>
      //   <View style={{ width: "100%", backgroundColor: "#F0F3F4", alignItems: 'center'}}>
      //   <View style={{ width: "90%", height: '18%', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white' }} >
      //     <View style={{ flexDirection: 'row' }}>
      //       <View style={{ width: '40%', alignItems: 'center' }}>
      //         <Skeleton h="93" w='100' rounded='10' />
      //       </View>
      //       <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
      //         <View style={{ flexDirection: 'column' }}>
      //           <Skeleton.Text lines={3} />
      //         </View>
      //         <View style={{ width: '90%' }}>
      //           <Skeleton h="3" rounded="full" startColor="amber.300" />
      //         </View>
      //       </View>
      //     </View>
      //   </View>
      // </View>
      // </View>
      // </NativeBaseProvider>
      <ActivityIndicator size="large" color="#5A56E9"/>
      : null
    );
  }
  const onEndReached = ()=>{
    setlimit(limit + 4);
    setLoading(false)
  }

  const getData = async () => {
    try {
      if(currentUser){
        setLogin(true)
        const res = await axios.post(`http://192.168.1.9:5000/sql/getOrderDetails/${limit}`,{user_id:currentUser.user[0].user_id},{
          headers: {
          'Authorization': `Bearer ${currentUser.token}` 
        }
        
      });
      setLoading(false)
      const result = res.data
      //console.log("datatatata==>",result);
      const main_arr = [result[0]];
      var id=result[0].order_id
      for (let i = 1; i < result.length; i++) {
        if(id === result[i].order_id){
            main_arr[i] = {
            item_id: result[i].item_id,
            product_id: result[i].product_id,
            quantity: result[i].quantity,
            imgs: result[i].imgs,
            name: result[i].name,
            price: result[i].price,
            orderStatus: result[i].orderStatus,
            status: result[i].status,
          };
        }
        else{
         id=result[i].order_id
         main_arr[i]=result[i]
        }
      }
      setOrdProducts(main_arr)
      setReload(false)
      setLoading(false)
    }
    else{
      console.log("Session is expireeeee");
      setLoading(false)
      setLogin(false)
    }
    } catch (e) {
      console.log('error', e);
      //console.log("eeee",e)
        if(e == "AxiosError: Request failed with status code 401"){
            Alert.alert(
                "Attention",
                "Your session is expired. Please login again",
                [
              {
                text: "Ok",
                onPress: async () => {
                    try {
                        const res= await axios.post('http://192.168.1.9:5000/sql/session',{user_id:currentUser.user[0].user_id},{
                            headers: {
                                'Authorization': `Bearer ${currentUser.token}` 
                            }
                        })
                        navigation.navigate('Profile')
                } catch (e) {
                    console.log("Something went wrong");
                }
            
            },
              }
            ]
            );
            dispatch(Logout());
        }
        else if(e == "AxiosError: Network Error"){
            // console.log("Something 2");
            // Alert.alert(
            //     "Network Error",
            //     "Please check your network connection.",
            //     [
            //   {
            //     text: "Ok",
            //     onPress: () => console.log("Ok"),
            //   }
            // ]
            // );
            ToastAndroid.showWithGravityAndOffset(  
              "No network connectivity",  
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50 
            )
        }
    }
  };

  useEffect(() => {
    getData();
  }, [reload,limit]);
  //console.log("data==>",OrdProducts);

  const renderItem = ({item}) => {
    //console.log("id==>",item.item_id);
    return (
      <View style={item.order_id?Style.card_main1:Style.card_main2}>
        {item.order_id?
        <View style={Style.card_header}>
          <View style={Style.card_footer2}>
          <Text style={Style.header_order_text}>Order {item.order_id}  </Text>
          <View style={Style.card_footer}>
          {/* <Text style={Style.card_footer_text1}>1 Items, </Text> */}
          <Text style={Style.card_footer_text2}>Total: Rs. {item.total}</Text>
          </View>
        </View>
          <View style={Style.placed}>
            <Text style={Style.placed_text}>Placed on {item.created_at.substring(0,10)}</Text>
            <Text style={Style.placed_status}>{item.status==0?'Unpaid':'Paid'}</Text>
          </View>
        </View>:null
        }
        <View style={Style.item_inside}>
          <View style={Style.img_view}>
            <Image
              source={{
                uri: `${item.imgs}`,
              }}
              style={Style.img}
            />
          </View>
          <View style={Style.details}>
            <Text style={Style.detail_text}>
            {item.name.split(/\s+/).slice(0, 4).join(" ") + "..."}
            </Text>
            <Text style={Style.price}>Rs. {item.price}</Text>
            <View style={Style.details_bottom}>
              <Text style={Style.qty}>Qty: {item.quantity}</Text>
              <Text style={Style.status}>{item.orderStatus}</Text>
            </View>
          </View>
        </View>
        {/* {item.order_id?
        <View style={Style.card_footer}>
          <Text style={Style.card_footer_text1}>1 Items, Total: </Text>
          <Text style={Style.card_footer_text2}>Rs. 99</Text>
        </View>:null
        } */}
      </View>
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
          <Text style={Style.head_text}>Your Orders</Text>
        </View>
      </View>
      {login ? (
        isLoading ? (
          <View style={Style.main_img}>
          <Image style={{width: 50, height: 50}} source={loaderGif} />
        </View>
        ) :
      OrdProducts && OrdProducts.length > 0 ? (
        <FlatList
          ListHeaderComponent={<View></View>}
          data={OrdProducts}
          keyExtractor={item => item.item_id}
          renderItem={renderItem}
          onEndReached={onEndReached}
          ListFooterComponent={flatListEnd}
          refreshing={IsRefreshing} onRefresh={onRefresh}
        />
      ) : (
        isLoading?(
        <View style={Style.main_img}>
          <Image style={{width: 50, height: 50}} source={loaderGif} />
        </View>
        ):(
        <View style={Style.main_img}>
          <Image style={{width: '70%', height: '35%'}} source={noOrder} />
          <Text style={{color: 'gray', fontWeight: '400'}}>You haven't ordered anything yet.</Text>
        </View>
        )
      )):(
        <View style={{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:20,color:"black",marginVertical:"5%"}}>Please login to continue</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={()=>navigation.navigate('Profile')} style={{alignItems:"center",padding:"3%",width:"50%",backgroundColor:"#5A56E9",borderRadius:5}}>
          <Text style={{fontSize:20,color:"#fff"}}>Login</Text>
        </TouchableOpacity>
        </View>
      )
      }
    </View>
  );
};

const Style = StyleSheet.create({
  all_item_main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f7f7f7',
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
  img_view: {
    // borderWidth:1,
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 80,
    width: '100%',
    borderRadius: 3,
  },
  details: {
    width: '65%',
    padding: 3,
    marginLeft: 5,
  },
  detail_text: {
    color: 'black',
    marginVertical: '1%',
  },
  details_bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_inside: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  status: {
    color: '#fff',
    marginVertical: '1%',
    backgroundColor: '#5A56E9',
    padding: 7,
    borderRadius: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
  price: {
    color: 'black',
    marginVertical: '1%',
    fontWeight: 'bold',
    fontSize: 14,
  },
  qty: {
    color: 'gray',
    marginVertical: '1%',
    fontSize: 12,
  },
  card_main1: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: 'gray',
  },card_main2: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#fff',
    borderColor: 'gray',
  },
  card_header: {
    backgroundColor: '#fff',
  },
  header_order_text: {
    color: 'black',
  },
  placed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placed_text: {
    color: 'gray',
  },
  placed_status: {
    color: 'gray',
    fontStyle: 'italic',
  },
  card_footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  card_footer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card_footer_text1: {
    color: 'black',
    fontSize: 14,
  },
  card_footer_text2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  main_img: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Orders;
