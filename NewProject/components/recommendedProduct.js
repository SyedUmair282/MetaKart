import { SafeAreaView, View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, } from 'react'




const RecommendedProduct = ({ productData }) => {

    const renderItem = ({ item }) => (
        <View style={Style.all_item_main2}>
            <View style={Style.all_item_main3}>
                <TouchableOpacity style={Style.all_item_main4}>
                    <Image style={Style.all_item_main4_img}
                        resizeMode="cover"
                        source={{ uri: item.imgs }}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={Style.cardTitle}>

                        {item.name.split(/\s+/).slice(0, 4).join(" ") + "..."}
                    </Text>
                    <View style={Style.cardBotm}>
                        <Text
                            style={Style.cardPrice}>
                            {item.price}
                        </Text>
                        <Text style={Style.rating}>
                            4.5{' '}
                            {/* <Icon style={Style.ratingIcon} name="md-star-half-sharp" /> */}
                        </Text>
                    </View>
                </View>

            </View>
        </View>
    );

    return (
        <View style={Style.all_item_main}>

            {productData >= 0 && productData
                ?
                <Text>noo recommend product</Text>
                 :
                 <FlatList
                    data={productData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            }
        </View>

    )
}


const Style = StyleSheet.create({
    middle2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
    },
    middle2_1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    middle2_1_text1: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B1621',
    },
    middle2_1_text2: {
        fontSize: 14,
        fontWeight: '200',
        color: 'black',
        opacity: 0.3,
        marginLeft: 10,
    },
    middle2_text1: {
        color: 'gray',
        marginRight: 1,
        letterSpacing: 1,
    },
    middle2_2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    middle2_2_icon: {
        fontSize: 15,
        marginRight: 10,
        color: "#C92252"
    },
    all_item_main: {
        flex: 1,
        width: "100%",
        backgroundColor: "#e8e7e6",
    },
    all_item_main2: {
        width: '50%',
        padding: 4,
        justifyContent: "center"
    },
    all_item_main3: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3.5,
        shadowColor: '#52006A',
    },
    all_item_main4: {
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: "#ACACAC",
        paddingBottom: 8,
    },
    all_item_main4_img: {
        width: '80%',
        height: 120
    },
    cardTitle: {
        margin: 2,
        color: 'black',
        fontSize: 13
    },
    cardPrice: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#8480C3',
    },
    ratingIcon: {
        color: '#FFCC4C',
        fontSize: 13,
    },
    rating: {
        color: '#E3A500',
        fontSize: 12,
    },
    cardBotm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: "5%",
        paddingLeft: "2%",
        alignItems: "center"
    }
});

export default RecommendedProduct;
