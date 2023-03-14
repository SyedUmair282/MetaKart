import { View, Text,Image,StyleSheet,TouchableOpacity } from 'react-native'
import React,{useState} from 'react';
import IconOcticons from 'react-native-vector-icons/Octicons';
import image from '../image/image-removebg-preview.png';
import Spinner from 'react-native-loading-spinner-overlay';
const Categories = ({navigate}) => {
  const [overlay,setOverlay]=useState(false);
  const [disable,setDisable]=useState(false);
  return (
    
        <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor:"#f7f7f7", paddingVertical:10 }}>
          <Spinner
          visible={overlay}
        />
          <TouchableOpacity style={styles.feature1} disabled={disable} activeOpacity={0.7} onPress={()=>{
            setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigate.navigate('Categories')
                setOverlay(false)
                setDisable(false)
              }, 1000);
            }}>
            <View style={{ flexDirection: "row", paddingTop: "4%" }}>
              <Text style={{ paddingLeft: 10, color: "#5956E9ed", fontWeight: "bold" }}>
                All Categories
              </Text>
              <IconOcticons name="arrow-right" style={{ fontSize: 22, paddingLeft: 2, color: "#5956E9" }} />
            </View>

            <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
              <Image style={{ width: 80, height: 50, marginBottom: -12 }} source={image} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.feature2} disabled={disable} activeOpacity={0.7} onPress={()=>{
            setDisable(true)
              setOverlay(true)
              setTimeout(() => {
                navigate.navigate('AllDiscountedProducts')
                setOverlay(false)
                setDisable(false)
              }, 1000);
            }}>
            <View style={{ flexDirection: "row", paddingTop: "4%" }}>
              <Text style={{ paddingLeft: 10, color:"#5956E9",fontWeight:"bold" }}>
                All Discount
              </Text>
              <IconOcticons name="arrow-right" style={{ fontSize: 22, paddingLeft: 2, color:"#5956E9" }} />
            </View>

            <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
              <Image style={styles.imageStyle}
                source={image} />
            </View>
          </TouchableOpacity>


        </View>
      
  )
}
const styles=StyleSheet.create({
    feature1: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "45%",
        height: 80,
        elevation:5,
        shadowColor:"#52006A",
        borderRadius: 16,
        backgroundColor:"white",
        padding:5
    
      },
      feature2: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "45%",
        height: 80,
        elevation:5,
        shadowColor:"#52006A",
        borderRadius: 16,
        backgroundColor:"white",
        padding:5
      },    

      imageStyle:{
        width: 80,
        height: 50,
        marginBottom: -12,
      }
})

export default Categories;






