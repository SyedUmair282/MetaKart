import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image,TouchableWithoutFeedback,Keyboard } from 'react-native';
import ComponentSearchBox from '../components/ComponentSearchBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Nosearch from '../assets/fonts/images/NoSearch.png';

const Search = () => {
  const [asyncStorageData, setAsyncStorageData] = useState([]);
  const [pic, setPic] = useState(true)
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigation()

  const dismissKeyBoard = () =>{
    Keyboard.dismiss();
}

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@searchItems');
      const json_parse = JSON.parse(jsonValue);
      console.log('daya==>', json_parse);
      if (json_parse == null) {
        setAsyncStorageData([]);
      } else {
        setAsyncStorageData(json_parse);
      }
      //return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const removeSpecificData = async () => {
    try {
      //let asyncData = await AsyncStorage.getItem('@searchItems');
      //asyncData = JSON.parse(asyncData);
      await AsyncStorage.removeItem('@searchItems');
      setAsyncStorageData('')
      //   if (asyncData) {
      //     // let cartItem = asyncData;
      //     // const removedData = cartItem.filter(object => object != data);
      //     // const removeData = asyncStorageData.filter(object => object != data);
      //     // setAsyncStorageData(removeData);
      //     //await AsyncStorage.setItem('@searchItems', JSON.stringify(removedData));
      //   }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const onSearch = (obj) => {
    navigate.navigate('SearchScreen', obj)
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyBoard}>

    <View style={{ width: '100%', height: '100%', backgroundColor: "#fff" }}>
      <ComponentSearchBox pic={setPic} />
      <View style={{ flex: 1 }}>
        {asyncStorageData.length > 0 ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: "bold", margin: "2.5%" }}>Search history</Text>
            <MaterialCommunityIcons onPress={removeSpecificData} name="delete" style={{ color: 'gray', fontSize: 22, fontWeight: "bold", margin: "2.5%" }} />
          </View>) :
          null
        }
        {asyncStorageData.length > 0 ? (
          <View
          style={{
            flexDirection: 'row',
            marginTop: -3
          }}>
            {asyncStorageData.map((obj, key) => {
              return (<TouchableOpacity onPress={() => onSearch(obj)} activeOpacity={0.7} style={{ borderRadius: 5, height: 33, alignItems: "center", marginHorizontal: 8, backgroundColor: 'lightgray' }} key={key}>
                <Text style={{ color: 'black', fontSize: 15, margin: 6 }}>{obj}</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    removeSpecificData(obj);
                  }}>
                  <Entypo name="cross" style={styles.searchIcon} />
                </TouchableOpacity> */}
              </TouchableOpacity>
              );
            }
            )
            }
          </View>
        ) : (pic ? (
          <View style={styles.main_img}>
            <Image style={{ width: '73%', height: '40%' }} source={Nosearch} />
            <Text style={{ color: 'gray', fontWeight: '400' }}>
              No search history
            </Text>
          </View>) : null
        )}
      </View>
    </View>
  </TouchableWithoutFeedback>

  );
};

export default Search;

const styles = StyleSheet.create({
  searchIcon: {
    color: 'red',
    fontSize: 20,
  },
  main_img: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
