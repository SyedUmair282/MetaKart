import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import SearchDropdown from './SearchDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';





const ComponentSearchBox = ({pic}) => {
    //const [isSearching , setIsSearching] = useState(false)
    const textInputRef = useRef()
    const [searchText, setSearchText] = useState("");
    const [filterData, setFilterData] = useState([]);
    const navigate = useNavigation()


  

    const addSuggestionWord = async (text) => {
        try {
          let asyncData = await AsyncStorage.getItem('@searchItems');
          asyncData = JSON.parse(asyncData);
          if (asyncData) {
            let cartItem = asyncData;
            cartItem.push(text);
            let uniqueChars = [...new Set(cartItem)];
            await AsyncStorage.setItem('@searchItems', JSON.stringify(uniqueChars));
          }
          else {
            let cartItem = [];
            cartItem.push(text);
            await AsyncStorage.setItem('@searchItems', JSON.stringify(cartItem));
          }
    
        } catch (error) {
          alert('Something went wrong');
        }
      }

    useEffect(() => {
        // const fetchAndSet = async()=>{
        //  var result= await axios.get(`http://10.0.2.2:5000/sql/suggest/women`)
        // //  result=await result.json();
        //  //console.log("data..>",result.data);
        //     .then(response => console.log("hello...",response.json()))
        //.then(result => console.log("hello==>",result.data))
        // .then(dataSource && dataSource.map(item => {
        //   filterData.push(item.name)
        // }))
        // .then(console.log(filterData))
        // .then(setIsSearching(true)
        // )
        //     .catch(err => console.log(err))
        // }

        // fetchAndSet();
        //console.log("dta is==>",dataSource);
        textInputRef.current.focus();
        var arr = []
        console.log("Search",searchText);
        const check = async () => {
            try {
                if (searchText.length !== null) {
                    const result = await axios.get(`http://192.168.1.9:5000/sql/suggest/${searchText}/5`);
                     if (result.data) {
                    //     result.data.map(item => {
                    //         return arr.push(item.name);
                    //     })
                        setFilterData(result.data)
                    }
                    else {
                        console.log("No data");
                    }
                    pic(false)
                }
                // else if(!searchText.length){
                //     pic(true)
                // }
            }
            catch (error) {
                console.log("error is",error);
                
                if(error=="AxiosError: Network Error"){
                    ToastAndroid.showWithGravityAndOffset(  
                      "No network connectivity",  
                      ToastAndroid.LONG,  
                      ToastAndroid.BOTTOM,
                      25,
                      50 
                    ); 
                  }
                // else if(error == "TypeError: null is not an object (evaluating 'searchText.length')"){
                //     pic(true)
                // }
            }

        }
        check()

    }, [searchText])

    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem('@searchItems')
        } catch (e) {
            // remove error
        }
        console.log('Done.')
    }


    const onChange = (text) => {
        if (text) {
            setSearchText(text)
        }
        else {
            setFilterData([])
            setSearchText(null)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <MaterialCommunityIcons name='account-outline' style={styles.accountIcon} onPress={() => navigate.navigate('Profile')} />
                <View style={styles.searchView}>
                    <Ionicons name='search-outline' style={styles.searchIcon} />
                    <TextInput
                        ref={textInputRef}
                        style={styles.search}
                        placeholder="Search Here"
                        placeholderTextColor="#EAE9FC"
                        onChangeText={(e) => onChange(e)}
                        onSubmitEditing={()=>{
                            if(searchText){
                                addSuggestionWord(searchText)
                                navigate.navigate("SearchScreen",searchText)
                            }
                        }} />
                </View>
                <Ionicons name="cart-outline" style={styles.cartIcon} onPress={() => navigate.navigate('AddToCart')} />
            </View>
            {searchText?
            <SearchDropdown dataSource={filterData} />:null
            }

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: '#5A56E9',
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 65
    },
    searchView: {

        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: "#EAE9FC",
        borderRadius: 50,
        paddingHorizontal: 5,
        width: '60%',
        height: 50
    },
    search: {
        backgroundColor: "#5A56E9",
        color: "#EAE9FC",
        fontSize: 15,
        fontWeight: "400",
        borderRadius: 50,
        height: 40,
        width:"90%"
    },
    searchIcon: {

        color: "#EAE9FC",
        fontSize: 20,

    },
    accountIcon: {

        color: "#EAE9FC",
        fontSize: 25
    },
    cartIcon: {

        color: "#EAE9FC",
        fontSize: 25
    }
});



export default ComponentSearchBox;