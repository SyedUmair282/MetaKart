import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {

  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  View,
} from 'react-native';
import SearchDropdown from './SearchDropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from '../redux/LoginRedux';
import IconBadge from 'react-native-icon-badge';

var count=0;

const SearchBar = () => {
    //const [searchText , setSearchText] = useState("");
    //const [filterData,setFilterData]=useState([]);
    
    const navigate = useNavigation()
    const focused=useIsFocused()
    const route=useRoute()
    
    
    // useEffect(() => {
    // var arr=[]
    // const check =async ()=>{
    //     try{
    //       if(searchText.length >= 1){
    //         const result= await axios.get(`http://192.168.1.9:5000/sql/suggest/${searchText}/5`);
    //       if (result.data) {
    //         result.data.map(item => {
    //           return arr.push(item);
    //         })
    //         setFilterData(arr)
    //       }
    //       else{
    //         console.log("No data");
    //       }
    //       }
    //     }
    //     catch(error){
    //       console.log("error");
    //     }
  
    //   }
    //   check()
      
    // }, [searchText])
    // const removeValue = async () => {
    //   try {
    //     await AsyncStorage.removeItem('@searchItems')
    //   } catch (e) {
    //     // remove error
    //   }
    //   console.log('Done.')
    // }

  //const navigate = useNavigation()
  const { isFetching, error, currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [countCart,setCountCart]=useState(0)
  //console.log("navigation==>",route.name)
  
  if(focused){
    if(currentUser){
      axios.post(`http://192.168.1.9:5000/sql/getCartItem`,{user_id:currentUser.user[0].user_id},{
        headers: {
          'Authorization': `Bearer ${currentUser.token}` 
        }
      })
      .then(function (res) {
        setCountCart(res.data.length)
        console.log("cart==>",countCart)
      }) 
      .catch(function (err) {
        console.log("error is==>",err)
        if(error=="AxiosError: Network Error"){
          ToastAndroid.showWithGravityAndOffset(  
            "No network connectivity",  
            ToastAndroid.LONG,  
            ToastAndroid.BOTTOM,
            25,
            50 
          ); 
        }
      })
    }
    else{
      //count=0
      //setCountCart(0)
    }
    console.log("hello focued")
  }

    const check_session=async()=>{
      console.log(currentUser)
      try {
      if(currentUser){
        const res= await axios.post('http://192.168.1.9:5000/sql/session',{user_id:currentUser.user[0].user_id},{
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        })

        if (res.data == "Status updated") {
          dispatch(Logout())
          console.log("Response is==>", res.data);
        }
        else {
          console.log("Response2 is==>", res.data);
        }
      }
      else {
        console.log("Session expired")
      }
    } catch (error) {
      if(error=="AxiosError: Network Error"){
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
    check_session();
  }, [])



  // const onSearch = () => {
  //     navigate.navigate('SearchScreen',searchText)
  // }


  // const onChange = (text)=> {

  //   if(text){
  //     setSearchText(text)
  //   }
  //   else{
  //     setFilterData([])
  //   }
  // }


  return (
    <>
      <View style={styles.container}>
        {currentUser ?
          <TouchableOpacity style={{ borderRadius: 200, alignItems: "center", width: "12%", justifyContent: "center", height: 42, backgroundColor: "pink" }} onPress={() => navigate.navigate('Profile')}>
            <Text style={{ fontSize: 25, color: "#fff" }}>{currentUser.user[0].first_name.substring(0, 1).toUpperCase()}</Text>
          </TouchableOpacity> :
          <MaterialCommunityIcons name='account-outline' style={styles.accountIcon} onPress={() => navigate.navigate('Profile')} />
        }
        <TouchableOpacity style={styles.searchView} onPress={() => navigate.navigate('Search')}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name='search-outline' style={styles.searchIcon} />
            {/* <TextInput
                        style={styles.search}
                        placeholder="Search Here"
                        placeholderTextColor="#EAE9FC"
                      onChangeText={(e) => onChange(e)} /> */}
            <Text style={{ marginLeft: 2, color: 'white' }}>Search here</Text>
          </View>
        </TouchableOpacity>
        <View>
          {currentUser?
        <IconBadge 
        BadgeElement={
          <Text style={{color:'#FFFFFF',fontSize:10}}>{countCart}</Text>
        }
        IconBadgeStyle={
          {width:10,
          height:18,
          backgroundColor: 'red'}
        }
        />:null}
        <Ionicons name="cart-outline" style={styles.cartIcon} onPress={() => navigate.navigate('AddToCart')} />
        </View>

        



      </View>
      {/* {searchText ?
              <SearchDropdown dataSource={filterData} navigate={navigate}/> :
              null
            } */}
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
    height: 65,
    zIndex: 9999,
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
  },
  searchIcon: {
    color: "#EAE9FC",
    fontSize: 20,

  },
  accountIcon: {
    color: "#EAE9FC",
    fontSize: 30
  },
  cartIcon: {
    color: "#EAE9FC",
    fontSize: 30,
    zIndex:-999,
    marginRight:"1%",
    marginTop:"1%"
  }
});



export default SearchBar;