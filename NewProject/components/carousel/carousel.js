import React, { useState, useEffect } from 'react'
import pic1 from '../../assets/fonts/images/pic1.png'
import pic2 from '../../assets/fonts/images/pic2.png'
import pic3 from '../../assets/fonts/images/pic3.png'
import { Dimensions, Text, View, Image, StyleSheet,LogBox } from 'react-native';
import Carousel from 'react-native-banner-carousel';



const CarouselSlider = () => {
  const BannerWidth = Dimensions.get('window').width;
  const BannerHeight = 180;
  const images = [
    pic1,
    pic2,
    pic3
];
useEffect(() => {
  LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])
  renderPage=(image, index)=>{
    return (
        <View key={index} style={{alignItems:"center"}}>
            <Image style={{ width: "95%", height: BannerHeight,borderRadius:10 }} source={image} />
        </View>
    );
  }

  return (
    <View style={styles.container}>
    <Carousel
        autoplay
        autoplayTimeout={4000}
        loop
        index={0}
        pageSize={BannerWidth}
        
    >
        {images.map((image, index) => renderPage(image, index))}
    </Carousel>
</View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      marginTop:"2%"
  },
});




export default CarouselSlider