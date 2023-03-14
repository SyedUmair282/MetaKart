import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React , {useState} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';


const SortBottomSheet = ({ props }) => {

    const [activity, setActivity] = useState(false);

    const handlePrice = () => {
        setActivity(true)
        props.setProducts([])
        setTimeout(() => {
            setActivity(false)
        }, 1500);
        if (props.filterPriceAsc) {
            props.handleFilterPrice('desc')
        } else if (props.filterPriceDesc) {
            props.handleFilterPrice('asc')
        } else {
            props.handleFilterPrice('asc')
        }

    }

    const handleRating = () => {
        setActivity(true)
        props.setProducts([])
        setTimeout(() => {
            setActivity(false)
        }, 1500);
        if (props.filterRatingAsc) {
            props.handleFilterRating('desc')
        } else if (props.filterRatingDesc) {
            props.handleFilterRating('asc')
        } else {
            props.handleFilterRating('asc')
        }

    }

    const handleRemove = () => {
        setActivity(true)
        props.setProducts([])
        setTimeout(() => {
            setActivity(false)
        }, 1500);
        props.setFilterPriceAsc(false)
        props.setFilterPriceDesc(false)
        props.setFilterRatingAsc(false)
        props.setFilterRatingDesc(false)
        props.getdata()
    }


    return (
       activity ?(
        <View style={styles.mainView}>
            <ActivityIndicator size='large' color="#5a56e9"/>
        </View>
       ):(
        <View style={styles.mainView}>
            {
            
                props.filterPriceAsc || props.filterPriceDesc ? (
                    props.filterPriceAsc ? (
                        <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handlePrice}>
                            <Text style={styles.optionText}>Price</Text>
                            <View style={styles.iconView}>
                                <AntDesign name='up' color="#5A56E9" size={30} style={styles.iconStyle} />
                                <AntDesign name='down' color="gray" size={30} style={styles.iconStyle} />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handlePrice}>
                            <Text style={styles.optionText}>Price</Text>
                            <View style={styles.iconView}>
                                <AntDesign name='up' color="gray" size={30} style={styles.iconStyle} />
                                <AntDesign name='down' color="#5A56E9" size={30} style={styles.iconStyle} />
                            </View>
                        </TouchableOpacity>
                    )
                ) : (
                    <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handlePrice}>
                        <Text style={styles.optionText}>Price</Text>
                        <View style={styles.iconView}>
                            <AntDesign name='up' color="gray" size={30} style={styles.iconStyle} />
                            <AntDesign name='down' color="gray" size={30} style={styles.iconStyle} />
                        </View>
                    </TouchableOpacity>
                )
            }

            {
                props.filterRatingAsc || props.filterRatingDesc ? (
                    props.filterRatingAsc ? (
                        <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handleRating}>
                            <Text style={styles.optionText}>Rating</Text>
                            <View style={styles.iconView}>
                                <AntDesign name='up' color="#5A56E9" size={30} style={styles.iconStyle} />
                                <AntDesign name='down' color="gray" size={30} style={styles.iconStyle} />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handleRating}>
                            <Text style={styles.optionText}>Rating</Text>
                            <View style={styles.iconView}>
                                <AntDesign name='up' color="gray" size={30} style={styles.iconStyle} />
                                <AntDesign name='down' color="#5A56E9" size={30} style={styles.iconStyle} />
                            </View>
                        </TouchableOpacity>
                    )
                ) : (
                    <TouchableOpacity style={styles.optionView} activeOpacity={0.7} onPress={handleRating}>
                        <Text style={styles.optionText}>Rating</Text>
                        <View style={styles.iconView}>
                            <AntDesign name='up' color="gray" size={30} style={styles.iconStyle} />
                            <AntDesign name='down' color="gray" size={30} style={styles.iconStyle} />
                        </View>
                    </TouchableOpacity>
                )
            }

            {
                props.filterPriceAsc || props.filterPriceDesc || props.filterRatingAsc || props.filterRatingDesc ? (
                    <TouchableOpacity style={styles.removeFilterView} activeOpacity={0.7} onPress={handleRemove}>
                        <Text style={styles.removeText}><AntDesign name='delete' color="white" size={22} style={styles.iconStyle} /> Remove Filter(s)</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.removeFilterView, { backgroundColor: 'gray' }]} activeOpacity={0.7} onPress={handleRemove} disabled>
                        <Text style={styles.removeText}><AntDesign name='delete' color="white" size={22} style={styles.iconStyle} /> Remove Filter(s)</Text>
                    </TouchableOpacity>
                )

            }

        </View>
       )
        
    )
}

export default SortBottomSheet

const styles = StyleSheet.create({
    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 25,
        width: '70%',
        alignSelf: 'center',
        elevation: 3,
        paddingVertical: '1%',
        backgroundColor: 'white',
        borderColor: '#bbb'

    },
    removeFilterView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 25,
        width: '50%',
        alignSelf: 'center',
        elevation: 3,
        paddingVertical: '2%',
        paddingHorizontal: '2%',
        backgroundColor: 'red',
        borderColor: '#bbb'

    },
    removeText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    },
    optionText: {
        fontSize: 24,
        color: '#5A56E9',
        fontWeight: '500'
    },
    iconView: {
        flexDirection: 'row',
    },
    iconStyle: {
        paddingHorizontal: '2%'
    },
    mainView: {
        flex: 1,
        justifyContent: 'space-around',
    }
})