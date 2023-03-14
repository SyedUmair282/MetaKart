import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import LinearGradient from 'react-native-linear-gradient';
import {Skeleton,NativeBaseProvider} from 'native-base'
import img from '../image/img.png';
import Spinner from 'react-native-loading-spinner-overlay';


const CategoryScreen = ({navigation}) => {
  
    const [categories,setCategories]=useState([])
    const [skeleton,setSkeleton]=useState(false)

    const [overlay,setOverlay]=useState(false);
    const [disable,setDisable]=useState(false);

    const getCategories=async()=>{
      try {
        setSkeleton(true)
        const data=await fetch('http://192.168.1.9:5000/sql/getMainCategories')
        const res=await data.json()
        setCategories(res)
        setSkeleton(false) 
      } catch (error) {
        console.log("error category",error)
        if(error=="TypeError: Network request failed"){
          ToastAndroid.showWithGravityAndOffset(  
            "No network connectivity",  
            ToastAndroid.LONG,  
            ToastAndroid.BOTTOM,
            25,
            50 
          ); 
        }
      }
    }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <NativeBaseProvider>

    <View style={{width:"100%",height:"100%",backgroundColor:"white"}}>
    <Spinner
      visible={overlay}
    />
      
      {skeleton===false?

        <ScrollView>
        <View style={{alignItems:'center', justifyContent:'center',width:"100%",backgroundColor:"white",height:"100%"}}>
       {categories.map((v,i)=>(
         <TouchableOpacity disabled={disable} key={i} activeOpacity={0.9} style={{marginVertical:"2%",width: "90%"}} onPress={()=>{
           setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigation.navigate('Subcategory',{hierarchy_id:v.hierarchy_id,cat_name:v.category_name.charAt(0).toUpperCase() + v.category_name.slice(1)})
                setOverlay(false)
                setDisable(false)
              }, 1000);
           }}>
             <LinearGradient style={styles.categoryCard} start={{x: 0, y: 0}} end={{x: 1.2, y: 0}} colors={['#fff', '#D1D1ED']}>
             <Text style={styles.cardText}>{v.category_name.charAt(0).toUpperCase() + v.category_name.slice(1)}</Text>
             <Image
             style={styles.logo}
             source={img}
             
               
           />
           </LinearGradient>
           </TouchableOpacity>
       )
       
       )}
       
        </View>
        </ScrollView>:
        <View style={{ width: "100%", backgroundColor: "#F0F3F4", alignItems: 'center',height:"100%",paddingTop:"2%"}}>
        <View style={{ marginVertical: "2%", width: "90%", height: '18%', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white' }} >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Skeleton h="93" w='100' rounded='10' />
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
              <View style={{ flexDirection: 'column' }}>
                <Skeleton.Text lines={3} />
              </View>
              <View style={{ width: '90%' }}>
                <Skeleton h="3" rounded="full" startColor="amber.300" />
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: "2%", width: "90%", height: '19%', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white' }} >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Skeleton h="93" w='100' rounded='10' />
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
              <View style={{ flexDirection: 'column' }}>
                <Skeleton.Text lines={3} />
              </View>
              <View style={{ width: '90%' }}>
                <Skeleton h="3" rounded="full" startColor="amber.300" />
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: "2%", width: "90%", height: '18%', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white' }} >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Skeleton h="93" w='100' rounded='10' />
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
              <View style={{ flexDirection: 'column' }}>
                <Skeleton.Text lines={3} />
              </View>
              <View style={{ width: '90%' }}>
                <Skeleton h="3" rounded="full" startColor="amber.300" />
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: "2%", width: "90%", height: '18%', justifyContent: 'center', borderRadius: 10, backgroundColor: 'white' }} >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Skeleton h="93" w='100' rounded='10' />
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '50%' }}>
              <View style={{ flexDirection: 'column' }}>
                <Skeleton.Text lines={3} />
              </View>
              <View style={{ width: '90%' }}>
                <Skeleton h="3" rounded="full" startColor="amber.300" />
              </View>
            </View>
          </View>
        </View>
      </View>
      }
        
    </View>
  </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  categoryCard: {
    width: "100%",
    height: 113,
    elevation: 3,
    borderColor: "#8580AF",
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',


        
    },
    cardText:{
        fontSize:25,
        color: "#5D59EE",
        marginLeft:"3%",
        width:"40%"
    },
    logo:{
        width: 150,
        height:100,
        resizeMode:'cover',
    },filter: {
      // borderWidth: 1,
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 5,
      flexDirection:'row',
      justifyContent:'flex-end',
      paddingRight:10
  
    },
    iconStyle: {
  
      color: "gray",
      fontSize: 25,
     
    },
    parentIcon:{
      flexDirection:'row',
      // borderWidth:1,
      width: 100,
      justifyContent:'space-between',
      
  
    }

});

export default CategoryScreen