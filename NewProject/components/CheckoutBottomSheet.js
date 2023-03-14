import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CheckoutBottomSheet = ({reference,total}) => {
    const navigate = useNavigation();
    const switchScreen = ()=>{
        reference.current.close();
        navigate.navigate('CheckoutScreen')
    }
  return (
    <View style={Style.order_detail}>
            <Text style={Style.head}>Order details</Text>
            <View style={{width:"100%",backgroundColor:"#fff"}}>
              <View style={Style.cartTotal}>
                <Text style={Style.cartTotal_text}>Cart Total:</Text>
                <Text style={Style.cartTotal_text}>Rs {total}.00</Text>
              </View>
              <View style={Style.cartTotal}>
                <Text style={Style.cartTotal_text}>Discount:</Text>
                <Text style={Style.cartTotal_text}>Rs 10.00</Text>
              </View>
            </View>
            <View style={Style.total}>
              <Text style={Style.Total_text}>Total Payable:</Text>
              <Text style={Style.Total_text}>Rs {total-10}.00</Text>
            </View>
            <View style={Style.checkout_view}>
              <TouchableOpacity style={Style.checkout_view_btn} activeOpacity={0.8} onPress={switchScreen}>
                <Text style={Style.checkout_view_text}>Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
  )
}

export default CheckoutBottomSheet

const Style = StyleSheet.create({
    order_detail: {
        marginTop: "8%",
        width: "100%",
        backgroundColor: "lightgray",
    
        borderRadius: 15,
        borderColor: "#fff"
      },
      head: {
        color: "black",
        fontWeight: "bold",
        fontSize: 17,
        margin: "3%"
      },
      cartTotal: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "3%",
        backgroundColor: "#fff"
      }, cartTotal_text: {
        color: "black"
      },
      total: {
        borderTopWidth: 1,
        borderTopColor: "lightgray",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "3%",
        width: "100%",
        backgroundColor: "#fff",
      },
      Total_text: {
        color: "black",
        fontWeight: "bold"
      },
      checkout_view: {
        borderTopWidth: 1,
        borderTopColor: "lightgray",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "3%",
        backgroundColor: "#fff",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    
      },
      checkout_view_btn: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        padding: "4%",
        backgroundColor: "#5A56E9",
        borderRadius: 10
      },
      checkout_view_text: {
        color: "#fff",
        fontWeight: "bold"
      }
})