import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Skeleton } from "native-base";


const SkeletonJs = () => {
    return (
        <View style={Style.all_item_main}>

            <View style={Style.all_item_main2}>
                <View style={Style.all_item_main3}>
                    <View style={Style.all_item_main4}>
                        <Skeleton h="40" />
                    </View>
                    <View>
                        <Skeleton.Text lines={3} px="1" />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5 }}>
                        <Skeleton size="5" rounded="full" />
                        <Skeleton h="5" w="10" startColor="amber.300" rounded="20" />
                    </View>
                </View>
            </View>

            <View style={Style.all_item_main2}>
                <View style={Style.all_item_main3}>
                    <View style={Style.all_item_main4}>
                        <Skeleton h="40" />
                    </View>
                    <View>
                        <Skeleton.Text lines={3} px="1" />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5 }}>
                        <Skeleton size="5" rounded="full" />
                        <Skeleton h="5" w="10" startColor="amber.300" rounded="20" />
                    </View>
                </View>
            </View>

        </View>
        // </ScrollView>

    )
}

const Style = StyleSheet.create({
    all_item_main: {
        flexDirection: 'row',
        flex: 1,
        width: "100%",
        backgroundColor: "#f7f7f7",
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
        // borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: "#ACACAC",
        paddingBottom: 8,
    }
});

export default SkeletonJs;