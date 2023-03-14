import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import React, { useRef, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import RBSheet from "react-native-raw-bottom-sheet";
import AddressBottomSheet from '../components/AddressBottomSheet';
import addressImg from '../image/address1.png'
import loadingGif from '../assets/fonts/images/loader.gif'
import { useDispatch, useSelector } from 'react-redux';
import { addressDelete } from '../redux/apiCalls'
import { NativeBaseProvider, Radio } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddressUpdateBottomSheet from '../components/AddressUpdateBottomSheet';
import axios from 'axios';




const AddressBook = ({route}) => {
  
  const net=NetInfo.useNetInfo().isConnected;

  let bgcolor = '#fff'
  const {checkOutTrigger,setCheckOutTrigger} = route.params
  const navigate = useNavigation()
  const dispatch = useDispatch()
  const refRBSheet = useRef();
  const refUpdateRBSheet = useRef();
  const [addressToUpdate, setAddressToUpdate] = useState({});
  const [dbAddress, setDbAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const {currentUser} = useSelector(state=>state.user)


  const modifyAddress = (element) => {

    setAddressToUpdate(element)
    refUpdateRBSheet.current.open()
  }

  const goToCheckOut = () =>{
    navigate.navigate('CheckoutScreen', selectedValue)
    setCheckOutTrigger(!checkOutTrigger)
  }




  useEffect(() => {
    setLoading(true)
    setDbAddress([])
     axios.get(`http://192.168.1.9:5000/sql/getAddress/${currentUser.user[0].user_id}`)
      .then(function (response) {
        setDbAddress(response.data)
        // setSelectedValue[dbAddress[0]]
        setLoading(false)
      })
      .catch(function (err) {
        console.log(err);
        if(err == "AxiosError: Network Error"){
          ToastAndroid.showWithGravityAndOffset(  
            "No network connectivity",  
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50 
          )
      }
      })
      //setTrigger(false)
  }, [trigger])



  return (
    <>
      <View style={styles.main}>

        {
          dbAddress?.length !== 0 ? (
            <NativeBaseProvider>
              <Radio.Group
                name="addressRadioGroup"
                value={selectedValue}
                onChange={(nextValue) => {
                  setSelectedValue(nextValue);
                }}>
                <ScrollView>
                  {dbAddress?.map((element, index) => (
                    <Radio style={{ width: "93%", alignSelf: 'center' }} key={element.address_id} colorScheme={"violet"} value={element} my="10">
                      <View style={styles.elevate}>
                        <View style={styles.addressCard}>
                          <View style={styles.addressDetails}>
                            <Text style={{ color: '#5A56E9', fontSize: 22, fontWeight: 'bold', marginVertical: '1%' }}>{element.address_title}</Text>
                            <Text style={{ marginVertical: '0.5%', fontWeight: '500' , color:'#000' }}>{element.address_line}</Text>
                            <Text style={{ marginVertical: '0.5%', fontWeight: '500' , color:'#000'}}>Recipent: {element.recipent}</Text>
                            <Text style={{ marginVertical: '0.5%', fontWeight: '500' , color:'#000'}}>{element.mobile}</Text>
                            {/* <TouchableOpacity>
                        <Text style={{marginVertical:'1%', fontWeight:'500',color:'#5A56E9' , fontSize}}>Edit</Text>
                      </TouchableOpacity> */}
                          </View>

                          <View style={styles.addressDelete}>
                            <TouchableOpacity onPress={() => {
                              addressDelete(dispatch, element.address_id, setTrigger)
                              // setTrigger(true)
                            }}>
                              <AntDesign name="delete" size={30} color='#5A56E9' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => modifyAddress(element)}>
                              <AntDesign name="edit" size={30} color='#5A56E9' />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Radio>
                  ))}
                </ScrollView>
              </Radio.Group>
            </NativeBaseProvider>
          ) : (
            loading === true ? (
              <View style={styles.imgView}>
                <Image style={styles.imgStyleGif} source={loadingGif}></Image>
              </View>
            ) : (
              <View style={styles.imgView}>
                <Image style={styles.imgStyle} source={addressImg}></Image>
                <Text style={{ color: 'gray', fontWeight: '400' }}>Click the icon to add an address</Text>
              </View>
            )
          )
        }


        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          height={450}
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
              elevation: 20,
              shadowColor: '#000',
              borderColor: 'lightgray',
              borderWidth: 1
            }

          }}
        >
          <AddressBottomSheet reference={refRBSheet} trigger={trigger} setTrigger={setTrigger} />
        </RBSheet>

        <RBSheet
          ref={refUpdateRBSheet}
          closeOnDragDown={true}
          height={450}
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
              elevation: 20,
              shadowColor: '#000',
              borderColor: 'lightgray',
              borderWidth: 1
            }

          }}
        >
          <AddressUpdateBottomSheet reference={refUpdateRBSheet} addressToUpdate={addressToUpdate} trigger={trigger} setTrigger={setTrigger} />
        </RBSheet>
      </View>

      {
        dbAddress.length === 0 ? (
          <View style={styles.bottomFlexSingle}>
            <TouchableOpacity style={styles.iconView2} activeOpacity={0.7} onPress={() => {
              if(net==true){
                refRBSheet.current.open();
              }
              else{
                  ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  ); 
              }
            }}>
              <MaterialIcons name='add-location-alt' color='#E9ECFF' size={40} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.checkBtn}>
              <TouchableOpacity style={styles.iconView2} activeOpacity={0.7} onPress={goToCheckOut}>
                <MaterialCommunityIcons name='check-bold' color='#E9ECFF' size={40} />
              </TouchableOpacity>
            </View>

            <View style={styles.addNewBtn}>
              <TouchableOpacity style={styles.iconView2} activeOpacity={0.7} onPress={() => {
                if(net==true){
                  refRBSheet.current.open();
                }
                else{
                    ToastAndroid.showWithGravityAndOffset(  
                      "No network connectivity",  
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50 
                    ); 
                }
                }}>
                <MaterialIcons name='add-location-alt' color='#E9ECFF' size={40} />
              </TouchableOpacity>
            </View>
          </>
        )
      }
    </>

  )
}

export default AddressBook

const styles = StyleSheet.create({
  main: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    paddingVertical: '2%'
  },
  iconView: {
    width: '15%',
    height: '10.3%',
    alignItems: 'center',
    borderRadius: 100,
    padding: 8,
    backgroundColor: '#605CE2',
    position: 'absolute',
    top: '86%',
    left: '80%',
    zIndex: 999
  },
  imgStyle: {
    width: 250,
    height: 250,
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
  addressCard: {
    padding: '3%',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 5,
  },
  elevate: {
    borderRadius: 0,
    shadowColor: "#888",
    width: '95%',
    alignSelf: 'center',
    elevation: 4,
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    marginVertical: '2%'
  },
  addressDetails: {
    paddingHorizontal: '2%',
    flex: 3
  },
  addressDelete: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: '2%'
  },
  selectBtn: {
    width: '37%',
    backgroundColor: '#605CE2',
    borderRadius: 10,
    paddingVertical: "1.5%",
    marginVertical: '9.5%',
    alignSelf: 'center',
    zIndex: 999,
    alignItems: 'center',
    paddingHorizontal: '2%'
  },
  iconView2: {
    alignItems: 'center',
    borderRadius: 100,
    padding: 8,
    backgroundColor: '#605CE2',
    zIndex: 999,

  },
  bottomFlex: {
    // flexDirection:'row',
    // justifyContent:'space-between',
    // alignItems:'center',
    // paddingHorizontal:'5%',
    // paddingVertical:'3%',
    // // backgroundColor:'transparent'
    // backgroundColor: 'rgba(52, 52, 52, 0.0)'
    borderWidth: 2,

    zIndex: 999
  },
  bottomFlexSingle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    backgroundColor: 'white'
  },
  checkBtn: {
    position: 'absolute',
    bottom: "5%",
    left: '5%',
    zIndex: 999
  },
  addNewBtn: {
    position: 'absolute',
    bottom: "5%",
    right: '5%',
    zIndex: 999
  }
})