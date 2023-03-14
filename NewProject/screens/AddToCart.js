import { View, Text, StyleSheet, TouchableOpacity,ToastAndroid,Image,Alert } from 'react-native';
import React, { useRef, useEffect,useState } from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import CheckoutBottomSheet from '../components/CheckoutBottomSheet';
import AddToCart_Comp from '../components/addToCart_Comp'
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import loadingGif from '../assets/fonts/images/loader.gif';
import { Logout } from '../redux/LoginRedux';
import Spinner from 'react-native-loading-spinner-overlay';

const AddToCart = ({ route, navigation }) => {
  const products = useSelector(state => state.test.products)
  const quantity = useSelector(state => state.test.quantity)
  const total = useSelector(state => state.test.total)
  //console.log('quantity',quantity);
  //console.log('total',total);
  const [dbProds, setDbProds] = useState([])
  const [trigger, setTrigger] = useState(true)
  const [loading, setLoading] = useState(true)
  const [login, setLogin] = useState(false);
  const [loader, setLoader] = useState(true);
  const [overlay,setOverlay]=useState(false)
  const {isFetching, currentUser, loadings} = useSelector(
    state => state.user,
  );
  const dispatch=useDispatch();



  useEffect(() => {

    
    if(currentUser){
      setLogin(true)
      //setDbProds([])
      axios.post(`http://192.168.1.9:5000/sql/getCartItem`,{user_id:currentUser.user[0].user_id},{
        headers: {
          'Authorization': `Bearer ${currentUser.token}` 
        }
      })
      .then(function (res) {
        //setDbProds([])
        setDbProds(res.data)
        setLoading(false)
        setLoader(false)
      })
      .catch(function (err) {
        console.log(err);
        console.log("hello",err)
        if(err == "AxiosError: Request failed with status code 401"){
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
                } catch (error) {
                    console.log("Something went wrong");
                }
            
            },
              }
            ]
            );
            dispatch(Logout());
        }
        else if(err == "AxiosError: Network Error"){
            ToastAndroid.showWithGravityAndOffset(  
              "No network connectivity",  
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50 
            )
        }
      })
    }
    else{
      setLogin(false)
      setLoader(false)
    }
  
  }, [trigger])



  const refRBSheet = useRef();

  const navigate = useNavigation();

  return (
    <View style={{flex:1}}>
      <Spinner
          visible={overlay}
        />
    {login ?
      (loader ? (
        <View style={Style.imgView}>
          <Image style={Style.imgStyleGif} source={loadingGif}></Image>
        </View>
      ) : 
      dbProds.length !== 0 ? (
      <View style={Style.main}>
        <View style={Style.topHeader}>
          <View style={Style.topHeader_inside}>
            {
              quantity !== 0 && total !== 0 ? (
                <>
                  <Text style={Style.topHeader_inside_text1}>ITEMS ({quantity})</Text>
                  <Text style={Style.topHeader_inside_text2}>TOTAL: RS {total}.00</Text>
                </>
              ) :
                null

            }

          </View>
        </View>

        <AddToCart_Comp products={dbProds} trigger={trigger} setTrigger={setTrigger} loading={loading} user_id={currentUser.user[0].user_id} token={currentUser.token} setOverlay={setOverlay}/>
        {
          quantity !== 0 && total !== 0 ? (
            <>
        <TouchableOpacity activeOpacity={1} onPress={() => refRBSheet.current.open()} style={{ width: "100%", backgroundColor: "white", padding: 10, justifyContent: "center", alignItems: "center", position: "absolute", bottom: 0, elevation:20, shadowColor:"black", borderWidth:1, borderColor:'#eee', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
          <Text>
            <SimpleLineIcons name='arrow-up' style={{ fontWeight: "bold", color: "black", fontSize: 25 }} />
          </Text>
        </TouchableOpacity>
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              height={310}
              openDuration={400}
              closeDuration={400}
              closeOnPressMask={true}
              closeOnPressBack={false}
              dragFromTopOnly={true}
              animationType="slide"
              customStyles={{
                wrapper: {
                  backgroundColor: "transparent"
                },
                draggableIcon: {
                  backgroundColor: "#000",
                  width: 75

                },
                container: {
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                }
                
              }}
              >
              <CheckoutBottomSheet total={total} reference={refRBSheet} />
            </RBSheet>
                </>
          ) : (
            null
          )
          }

        
      </View>
    ) : (
      <View style={Style.main}>

        <AddToCart_Comp products={dbProds} trigger={trigger} setTrigger={setTrigger} loading={loading} user_id={currentUser.user[0].user_id} token={currentUser.token}/>
        {/* <Text>hello</Text> */}
      </View>
    )
    ):(loader ? (
      <View style={Style.imgView}>
        <Image style={Style.imgStyleGif} source={loadingGif}></Image>
      </View>
    ):<View style={{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}>
    <Text style={{fontSize:20,color:"black",marginVertical:"5%"}}>Please login to continue</Text>
    <TouchableOpacity activeOpacity={0.7} onPress={()=>navigation.navigate('Profile')} style={{alignItems:"center",padding:"3%",width:"50%",backgroundColor:"#5A56E9",borderRadius:5}}>
      <Text style={{fontSize:20,color:"#fff"}}>Login</Text>
    </TouchableOpacity>
    </View>)
  }
</View>
  )
}
const Style = StyleSheet.create({
  main: {
    width: "100%",
    backgroundColor: "#fff",
    height: "100%"
  },
  topHeader: {
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    zIndex: 99999
  },
  topHeader_inside: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    padding: 5,
    backgroundColor: "white"
  },
  topHeader_inside_text1: {
    color: "black",
    fontWeight: "bold"
  },
  topHeader_inside_text2: {
    color: "black",
    fontWeight: "bold"
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
})

export default AddToCart;