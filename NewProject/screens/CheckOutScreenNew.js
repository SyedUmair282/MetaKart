import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import { Radio, NativeBaseProvider } from 'native-base'
import axios from 'axios'
import { useSelector } from 'react-redux';
import loadingGif from '../assets/fonts/images/loader.gif'


const CheckOutScreenNew = ({ route }) => {
  const navigate = useNavigation()
  const address = useSelector(state => state.address)
  const selectedValue = route.params
  console.log('selected=>', selectedValue);
  const [dbAddress, setDbAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkOutTrigger, setCheckOutTrigger] = useState(true);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    if (selectedValue) {
      setDbAddress(selectedValue)
    } else {

      axios.get(`http://192.168.1.9:5000/sql/getAddress/${currentUser.user[0].user_id}`)
        .then(function (response) {
          setDbAddress(response.data[0])
          setLoading(false)
        })
        .catch(function (err) {
          console.log(err);
          if (err == "AxiosError: Network Error") {
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
  }, [checkOutTrigger])

  return (
    <>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.informationView}>
            <Text style={{ color: "#444", fontSize: 20, fontWeight: '500' }}>Shipping Information</Text>
            <TouchableOpacity onPress={() => navigate.navigate('AddressBook', { checkOutTrigger, setCheckOutTrigger })}>
              <Text style={styles.buttonAdd}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addAddressBtnView}>
            {
              dbAddress.length !== 0 ? (
                selectedValue !== undefined ? (
                  Object.keys(selectedValue).length !== 0 ? (
                    <View style={styles.addressDetailsView}>
                      <View style={styles.addressDetailsInside}>
                        <Octicons name="person" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{selectedValue.recipent}</Text>
                      </View>
                      <View style={styles.addressDetailsInside}>
                        <Octicons name="location" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{selectedValue.address_line}</Text>
                      </View>
                      <View style={styles.addressDetailsInside}>
                        <Feather name="phone" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{selectedValue.mobile}</Text>
                      </View>
                    </View>

                  ) : (
                    <View style={styles.addressDetailsView}>
                      <View style={styles.addressDetailsInside}>
                        <Octicons name="person" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{dbAddress.recipent}</Text>
                      </View>
                      <View style={styles.addressDetailsInside}>
                        <Octicons name="location" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{dbAddress.address_line}</Text>
                      </View>
                      <View style={styles.addressDetailsInside}>
                        <Feather name="phone" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>+92 {dbAddress.mobile}</Text>
                      </View>
                    </View>
                  )
                ) : (
                  <View style={styles.addressDetailsView}>
                    <View style={styles.addressDetailsInside}>
                      <Octicons name="person" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{dbAddress.recipent}</Text>
                    </View>
                    <View style={styles.addressDetailsInside}>
                      <Octicons name="location" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>{dbAddress.address_line}</Text>
                    </View>
                    <View style={styles.addressDetailsInside}>
                      <Feather name="phone" size={30} color="#444" style={{ flex: 1 }} /><Text style={styles.detailsText}>+92 {dbAddress.mobile}</Text>
                    </View>
                  </View>
                )
              ) : (

                loading === true ? (
                  <View style={styles.loaderGifView}>
                    <Image style={styles.imgStyleGif} source={loadingGif}></Image>
                  </View>

                ) : (
                  <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigate.navigate('AddressBook', { checkOutTrigger, setCheckOutTrigger })}>
                    <Entypo name="plus" size={30} color="#444" />
                    <Text style={{ fontSize: 21 }}> Add Address</Text>
                  </TouchableOpacity>
                )

              )
            }

          </View>

          <View style={[styles.informationView, { marginTop: '4%' }]}>
            <Text style={{ color: "#444", fontSize: 20, fontWeight: '500' }}>Payment Information</Text>
            <TouchableOpacity activeOpacity={1}>
              <Text style={[styles.buttonAdd, { color: 'white' }]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '70%', alignSelf: 'center' }}>
            <NativeBaseProvider>
              <Radio.Group
                name="paymentRadioGroup"
                value={"cod"}
                defaultValue={"cod"}
              >
                <Radio style={{ width: "90%", alignSelf: 'center', justifyContent: 'center' }} value={"cod"} my="5">
                  <MaterialCommunityIcons name="cash" size={35} color="#7FB848" />
                  <Text style={{ fontSize: 22, fontWeight: '600', color: '#000' }}> Cash On Delivery</Text>
                </Radio>

              </Radio.Group>
            </NativeBaseProvider>
          </View>
        </View>
      </ScrollView>
      {
        dbAddress.length !== 0 ? (
          <View style={styles.finalCheckout}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigate.navigate('Summary', { data: dbAddress })}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default CheckOutScreenNew

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'center',
    width: "100%",
    marginVertical: '5%',
  },
  buttonAdd: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    opacity: 1,
    backgroundColor: "#5D59EE",
    padding: 5,
    borderRadius: 10,
    width: 60,
    textAlign: 'center'
  },
  addAddressBtnView: {
    alignSelf: 'center',
    marginVertical: '7%',
    width: '75%'
  },
  addressDetailsView: {
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: '5%'
  },
  addAddressBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: '2.5%',
    paddingHorizontal: '2.5%',
    backgroundColor: '#D9D9D9',
    elevation: 10,
    shadowColor: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  informationView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  addressDetailsInside: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginVertical: '2.5%',
    alignItems: 'center'
  },
  detailsText: {
    fontSize: 21,
    color: '#666',
    flex: 3
  },
  finalCheckout: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: '0%',
    justifyContent: 'center',
    zIndex: 999,
    width: "100%"
  },
  checkoutBtn: {
    backgroundColor: '#5D59EE',
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#333'
  },
  checkoutBtnText: {
    fontSize: 22,
    color: 'white',
    fontWeight: '600'
  },
  imgStyleGif: {
    width: 50,
    height: 50,
  },
  loaderGifView: {
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})