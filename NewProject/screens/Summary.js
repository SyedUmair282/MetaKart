import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import {Modal,NativeBaseProvider} from 'native-base';
import axios from 'axios';
import orderSuccess from '../assets/fonts/images/orderSuccesfull.gif'
import Spinner from 'react-native-loading-spinner-overlay';



const Summary = ({route,navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const {data}=route.params
  const testProducts = useSelector(state => state.test.products);
  const testquantity = useSelector(state => state.test.quantity);
  const testTotal = useSelector(state => state.test.total);
  const {currentUser} = useSelector(state => state.user);
  const [disable,setDisable]=useState(false)
  const [overlay,setOverlay]=useState(false)
  

  
  console.log("data==>",testProducts,testquantity,testTotal);

  const Checkout=async()=>{
    try{
      setDisable(true)
      setOverlay(true)
      const obj={
        amount:testTotal,
        prodArr:testProducts,
        user_id:currentUser.user[0].user_id
        
      }
      await axios.post('http://192.168.1.9:5000/sql/setOrderDetails', obj)
      setOverlay(false)
      setShowModal(true)
      console.log("Data inserted successfully");
      setTimeout(()=>{
        setShowModal(false)
        navigation.navigate('TabNav')
        setDisable(false)
      }, 2000)
    }catch(error){
      console.log("error",error)
      if(error=="AxiosError: Network Error"){
        ToastAndroid.showWithGravityAndOffset(  
          "No network connectivity",  
          ToastAndroid.LONG,  
          ToastAndroid.BOTTOM,
          25,
          50 
        ); 
        setOverlay(false)
        setShowModal(false)
        setDisable(true)
      }
      setOverlay(false)
      setShowModal(false)
      setDisable(true)
    }
  }

  return (
    <NativeBaseProvider>
    <View style={Style.main} >
    <Spinner
          visible={overlay}
        />
      {/* Header */}
      <View style={Style.topHeader}>
        <View style={Style.topHeader_inside}>
          <>
            <Text style={Style.topHeader_inside_text1}>ITEMS ({testquantity})</Text>
            <Text style={Style.topHeader_inside_text2}>TOTAL: Rs. {testTotal}.00</Text>
          </>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* listHeader */}
        <View style={{padding: '3%', marginBottom: '20%'}}>
          <View style={Style.items}>
            <View style={Style.items_head}>
              <Text style={Style.items_head_text}>{testquantity} Items</Text>
            </View>

            {/* list */}
            {testProducts && testProducts.map((v,i)=>{
              return <View style={Style.items_list} key={i} >
              <View>
                <Image
                  source={{
                    uri: v.imgs,
                  }}
                  style={Style.img}
                />
              </View>
              <View style={{width:"68%"}}>
                <Text style={Style.items_list_text_desc}>
                {v.name.split(/\s+/).slice(0, 5).join(" ") + "....."}
                </Text>
                <Text style={Style.items_list_text_same}>Size: NA</Text>
                <Text style={Style.items_list_text_same}>Color: NA</Text>
                <Text style={Style.items_list_text_same}>Qty: {v.quantity}</Text>
                <Text style={Style.items_list_text_price}>Rs. {v.price}.00</Text>
              </View>
            </View>
            })}
           </View>

           {/* Shipping */}
          <View style={{marginVertical: '3%'}}></View>
          <View style={Style.items}>
            <View style={Style.items_head}>
              <Text style={Style.items_head_text}>Shipping Address</Text>
            </View>
            <View style={Style.address_list}>
              <Text style={Style.address_list_text_same}>
                {data.address_line}, Pakistan.
              </Text>
              <Text style={Style.address_list_text_same}>{data.address_title}.</Text>
              <Text style={Style.address_list_text_same}>Receiving by {data.recipent}.</Text>
            </View>
          </View>

          {/* Contacts */}
          <View style={{marginVertical: '3%'}}></View>
          <View style={Style.items}>
            <View style={Style.items_head}>
              <Text style={Style.items_head_text}>Contacts</Text>
            </View>
            <View style={Style.address_list}>
              <Text style={Style.address_list_text_same}>{data.mobile}</Text>
            </View>
          </View>

          {/* PaymentMethod */}
          <View style={{marginVertical: '3%'}}></View>
          <View style={Style.items}>
            <View style={Style.items_head}>
              <Text style={Style.items_head_text}>Payment Method</Text>
            </View>
            <View style={Style.address_list}>
              <Text style={Style.address_list_text_same}>Cash on delivery.</Text>
            </View>
          </View>

          {/* OrderDeatils */}
          <View style={{marginVertical: '3%'}}></View>
          <View style={Style.items}>
            <View style={Style.items_head}>
              <Text style={Style.items_head_text}>Order Details</Text>
            </View>
            <View style={Style.address_list}>
              <View style={Style.order_list_views}>
                <Text style={Style.order_list_text_same}>Order Total:</Text>
                <Text style={Style.order_list_text_same}>Rs. {testTotal}.00</Text>
              </View>
              <View style={Style.order_list_views}>
                <Text style={Style.order_list_text_same}>
                  Shipping Charges:
                </Text>
                <Text style={Style.order_list_text_same}>Rs. 200.00</Text>
              </View>
              <View style={Style.order_list_views}>
                <Text style={Style.order_list_text_same}>
                  Discount:
                </Text>
                <Text style={Style.order_list_text_same}>Rs. 10.00</Text>
              </View>
              <View style={Style.order_list_views_end}>
                <Text style={Style.order_list_text_same_end}>
                  Total Payable:
                </Text>
                <Text style={Style.order_list_text_same_end}>Rs. {testTotal+200-10}.00</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Checkout button */}
          <TouchableOpacity disabled={disable} activeOpacity={1} style={{backgroundColor:"#5A56E9",position:"absolute",bottom:"4.5%",width:"100%",height:"8%",alignItems:"center",justifyContent:"center"}}
          onPress={()=>Checkout()}>
          <Text style={{color:"white",fontWeight:"bold",fontSize:17,letterSpacing:3}}>Place Order</Text>
      </TouchableOpacity>

            {/* Modal */}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
      
      bg: "#000000"
    }} backdropVisible={false}>
        <Modal.Content maxWidth="400px" >
          <Modal.Header style={{backgroundColor:"#5A56E9"}} width="100%">
            <Text style={{color:"white",fontSize:18}}>Your order has been confirmed</Text>
            </Modal.Header>
          <Modal.Body style={{backgroundColor:"white"}}>
            <Image source={orderSuccess} style={{height:120,width:120,alignSelf:"center"}}/>
                  <Text style={{alignSelf:"center",color:"black"}}>Thankyou for order</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>


    </View>
    </NativeBaseProvider>
  );
};

export default Summary;

const Style = StyleSheet.create({
  main: {
    width: '100%',
  },
  topHeader: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    zIndex: 99999,
  },
  topHeader_inside: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    padding: 5,
    backgroundColor: 'white',
  },
  topHeader_inside_text1: {
    color: 'black',
    fontWeight: 'bold',
  },
  topHeader_inside_text2: {
    color: 'black',
    fontWeight: 'bold',
  },
  items: {
    borderWidth: 1,
    width: '100%',
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor:'#fff'
  },
  items_head: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#5A56E9',
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
    borderColor:'#fff'
  },
  items_head_text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
  items_list: {
    borderTopWidth: 1,
    borderColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '2%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#fff'
  },
  img: {
    width: 100,
    height: 100,
  },
  items_list_text_desc: {
    color: 'gray',
    fontSize: 15,
  },
  items_list_text_same: {
    color: 'gray',
    fontSize: 12,
  },
  items_list_text_price: {
    color: 'black',
    fontWeight: 'bold',
  },
  address_list: {
    borderTopWidth: 1,
    borderColor: '#cccccc',
    width: '100%',
    padding: '2%',
  },
  address_list_text_same: {
    color: '#575757',
    fontSize: 14,
  },
  order_list_views: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
  order_list_text_same: {
    color: 'black',
    fontSize: 14,
  },
  order_list_views_end: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '2%',
    borderTopWidth: 1,
    borderColor: '#cccccc',
  },
  order_list_text_same_end: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
