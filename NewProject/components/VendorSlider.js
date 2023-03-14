import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity,Alert,ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Skeleton, NativeBaseProvider, Center } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
const items = [
  {
    image: require("../assets/fonts/images/samsung.png"),
    text: "Pick-up",
  },

];

const VendorSlider = ({ popular, setPopular }) => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [skeleton, setSkeleton] = useState(false)

  const [overlay,setOverlay]=useState(false)
  const [disable,setDisable]=useState(false)

  useEffect(() => {
    setSkeleton(true)
    fetch('http://192.168.1.9:5000/sql/allVenders')
      .then((response) => response.json())
      .then((json) => {
        setApiData(json)
        setSkeleton(false)
      })
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
        }
      })
    setPopular(false)
  }, [popular]);
  const navigation = useNavigation();
  return (
    <NativeBaseProvider>

      <View style={{
        width: "100%",
        padding: "2.5%",
      }}>
        <Spinner
          visible={overlay}
        />
        <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'black' }}>Popular Vendors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {skeleton === false ? apiData.map((item, index) => (
            <TouchableOpacity key={index} disabled={disable} style={{ alignItems: 'center', marginRight: 20, marginTop: 5 }} onPress={() => {
              setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigation.navigate('AllVendorProducts', {
                vendorId: item.vendorsId,
                vendorName: item.vendorName
                })
                setOverlay(false)
                setDisable(false)
              }, 1000);
            }}  >

                <Image source={{ uri: item.vendorLogo }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius:50,
                    borderWidth:1,
                    borderColor:'#ddd',
                    resizeMode:'contain',
                    backgroundColor:'white'
                  }} />



              {/*below code is optional if you want to add text below the logos */}

              {/* <Text style={{ fontSize: 13, fontWeight: "900" }}>{item.vendorName}</Text> */}

            </TouchableOpacity>


          )) :
            <View style={{ width: "100%", flexDirection: "row", height: "87%" }}>

              <View activeOpacity={0.9} style={{ padding: 5 }}>
                <Skeleton borderColor="coolGray.200" mb="3" w="57" h="57" rounded="30" startColor="coolGray.300" />
              </View>
              <View activeOpacity={0.9} style={{ padding: 5 }}>
                <Skeleton borderColor="coolGray.200" mb="3" w="57" h="57" rounded="30" startColor="coolGray.300" />
              </View>
              <View activeOpacity={0.9} style={{ padding: 5 }}>
                <Skeleton borderColor="coolGray.200" mb="3" w="57" h="57" rounded="30" startColor="coolGray.300" />
              </View>
              <View activeOpacity={0.9} style={{ padding: 5 }}>
                <Skeleton borderColor="coolGray.200" mb="3" w="57" h="57" rounded="30" startColor="coolGray.300" />
              </View>
              <View activeOpacity={0.9} style={{ padding: 5 }}>
                <Skeleton borderColor="coolGray.200" mb="3" w="57" h="57" rounded="30" startColor="coolGray.300" />
              </View>

            </View>
          }
        </ScrollView>
      </View>
    </NativeBaseProvider>
  )
}

export default VendorSlider