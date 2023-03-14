import { loginStart, loginSuccess, loginFailure,Logout } from './LoginRedux'
import { registerStart, registerFailure, registerSuccess } from './RegisterRedux'
import { addAddress, updateAddress, deleteAddress, errorAddress } from './AddressRedux'
import { deleteProductTest } from './Test_Redux'
import axios from 'axios';

import { addFavourite, getFavourite, removeFavourite } from './FavouritesRedux';
import { Alert , ToastAndroid} from 'react-native';
//import { useNavigation } from '@react-navigation/native'

//import { useDispatch, useSelector } from 'react-redux';

export const login = async (dispatch, user) => {
    
    try {
        dispatch(loginStart());
        const res = await axios.post("http://192.168.1.9:5000/sql/login", {email:user.email,password:user.password,phone:null});
        let obj={
            load:false,
            data:res.data
        }
        dispatch(loginSuccess(obj));
        user.navigation.navigate('Home');
        user.setDisable(false);
        
    } catch (error) {
        // user.setDisable(false);
        dispatch(loginFailure(true));
        console.log("No data");
    }
}
// Gmail and facebook auth
export const loginAuth = async (dispatch, user) => {
    
    try {
        //dispatch(loginStart());
        const res=await axios.post('http://192.168.1.9:5000/sql/loginWithAuth',user[1])
        //console.log("redux data==>",res.data);
        let obj={
            load:false,
            data:res.data
        }
        dispatch(loginSuccess(obj));
        user[0].navigate.navigate('TabNav');
        
    } catch (error) {
        //dispatch(loginFailure(true));
        console.log("No data",error);
    }
}

export const register = async (dispatch, user) => {
    try {
        console.log(user)
        dispatch(registerStart());
        const res = await axios.post("http://192.168.1.9:5000/sql/register", { username:user.username, email:user.email, password:user.password, first_name:user.first_name, last_name:user.last_name,phone:null });
        let obj={
            load:false,
            data:res.data
        }
       const statusAPI = res.status
       if (res.status===200) {
        let obj={
            load:false
        }
        Alert.alert(
            "Register Failed",
            "Email already in use.",
            [
                {
                    text: "Ok",
                    onPress: () => console.log("ok pressed")
                },
                
            ]
            );
            dispatch(registerFailure(obj));
        
       }else if (res.status===201) {
        dispatch(registerSuccess(obj));
        Alert.alert(
            "Register successfully",
            "Please verify your mail",
            [
          {
            text: "Ok",
            onPress: () => user.navigation.navigate('Login')
          },
          
        ]
        );
        
       } else {
        
       }
    
    } catch (error) {
        dispatch(registerFailure(true));
        console.log("Error==>",error);
        if(error == "AxiosError: Network Error"){
            
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        
    }
}

export const addressAdd = async (dispatch, addressPayload,setDisable,setTrigger) => {
    try {
        setTrigger(true)
        const res = await axios.post("http://192.168.1.9:5000/sql/addAddress", addressPayload);
        setDisable(false)
        setTrigger(false)
    } catch (error) {
        dispatch(errorAddress());
        if(error == "AxiosError: Network Error"){
           
            setDisable(false);
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
      
        setDisable(false);
    }
}

export const addressDelete = async (dispatch, addressId, setTrigger) => {
    try {
        setTrigger(true)
        const res = await axios.put(`http://192.168.1.9:5000/sql/deleteAddress/${addressId}`);
        setTrigger(false)
    } catch (error) {
        dispatch(errorAddress());
        if(error == "AxiosError: Network Error"){
           
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        
    }
}

export const addressUpdate = async (dispatch, addressObj,setTrigger) => {
    try {
        setTrigger(true)
        const res = await axios.put(`http://192.168.1.9:5000/sql/updateAddress/${addressObj.address_id}`, addressObj.payload);
        setTrigger(false)
    } catch (error) {
        dispatch(errorAddress());
        if(error == "AxiosError: Network Error"){
            
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
     
    }
}
export const addToCart = async (dispatch, prod,setOverlay,navigation,setDisable) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${prod.token}` } }
        await axios.post('http://192.168.1.9:5000/sql/addCartItem', prod,config)
        setOverlay(false)
        navigation.navigate('AddToCart')
        setDisable(false)
    } catch (error) {
        console.log(error);
        if(error == "AxiosError: Network Error"){
            setOverlay(false);
            setDisable(false);
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        setOverlay(false);
        setDisable(false);
    }
}

export const cartModificationDecrease = async (dispatch, prod,setOverlay,setDisable) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${prod.token}` } }
        await axios.post('http://192.168.1.9:5000/sql/delCartItem', prod,config);
        setOverlay(false);
        setDisable(false)
    } catch (error) {
        console.log(error);
        if(error == "AxiosError: Network Error"){
            setOverlay(false);
            setDisable(false);
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        setOverlay(false);
        setDisable(false);
    }
}

export const cartModificationIncrease = async (dispatch, prod,setOverlay,setDisable) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${prod.token}` } }
        await axios.post('http://192.168.1.9:5000/sql/addCartItem', prod,config);
        setOverlay(false);
        setDisable(false)
    } catch (error) {
        console.log(error);
        if(error == "AxiosError: Network Error"){
            setOverlay(false);
            setDisable(false);
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        setOverlay(false);
        setDisable(false);
    }
}
export const deleteFromCart = async (dispatch, prod) => {
    try {
        await axios.post('http://192.168.1.9:5000/sql/deleteFromCart', prod)
    } catch (error) {
        console.log(error);
        if(error == "AxiosError: Network Error"){
            
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        
    }
}
export const addFavouriteDB = async (dispatch, data) => {
    //dispatch(registerStart());

    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` } }
        const res = await axios.post("http://192.168.1.9:5000/sql/setFavourites", { favouritedProd: data.product_id , user_id:data.user_id } , config);
        // const result=await res.json()
        dispatch(addFavourite(res.data));
        //console.log(res.data);

        // console.log("db");

    } catch (error) {
        console.log(error);
        if(error == "AxiosError: Network Error"){
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
    }
}


export const getFavouriteDB = async (dispatch,user,navigation) => {
    //dispatch(registerStart());

    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } }
        const res = await axios.post("http://192.168.1.9:5000/sql/getFavourites",{user_id:user.user[0].user_id},config);
        dispatch(getFavourite(res.data));
        console.log("token",res.data);

    } catch (error) {
        console.log("hello",error)
        if(error == "AxiosError: Request failed with status code 401"){
            Alert.alert(
                "Attention",
                "Your session is expired. Please login again",
                [
              {
                text: "Ok",
                onPress: async () => {
                    try {
                        const res= await axios.post('http://192.168.1.9:5000/sql/session',{user_id:user.user[0].user_id},{
                            headers: {
                                'Authorization': `Bearer ${user.token}` 
                            }
                        })
                        console.log("res of fav",res.data);
                        navigation.navigate('Profile')
                } catch (error) {
                    console.log("Something went wrong");
                }
            
            },
              }
            ]
            );
            dispatch(Logout());
        }
        else if(error == "AxiosError: Network Error"){
            
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
    }
}

export const remFavouriteDB = async (dispatch, data) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` } }
        const res = await axios.post("http://192.168.1.9:5000/sql/delFavourites", { favouritedProd: data.product_id , user_id:data.user_id} , config);
        // const result=await res.json()
        dispatch(removeFavourite(res.data));
        //  console.log(res.data);
        data.setDisable(false)
        data.setOverlay(false)
    } catch (error) {
        console.log(error)
        if(error == "AxiosError: Network Error"){
            data.setDisable(false)
            data.setOverlay(false)
            return(
                ToastAndroid.showWithGravityAndOffset(  
                    "No network connectivity",  
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50 
                  )
            )
        }
        data.setDisable(false)
        data.setOverlay(false)
    }
}




