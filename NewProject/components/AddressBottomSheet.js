import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { addressAdd } from '../redux/apiCalls'
import { useDispatch,useSelector } from 'react-redux';

const AddressBottomSheet = ({reference,trigger,setTrigger}) => {
    const dispatch = useDispatch()
    const [title, setTttle] = useState("")
    const [recipent, setRecipent] = useState("")
    const [address, setAddress] = useState("")
    const [phoneInput, setPhoneInput] = useState("")
    const [invalidChar, setInvalidChar] = useState(false)
    const {currentUser} = useSelector(state=>state.user)
    const [disable,setDisable]=useState(false)
    const [invalidNum,setInvalidNum]=useState(false)

    const handlePress = () => {
        if(title && recipent && address && phoneInput){

            let regex1 = "[0-9*#+]+"
            let regex2 = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            let regex3 = "^[0-9]{1,45}$"
            if(recipent.match(regex1) !== null){
                setInvalidChar(true)
                console.log('regexwork IF');
            }else if(recipent.match(regex2) !== null){
                setInvalidChar(true)
                console.log('regexwork ELSE IF');
            }
            else if(!phoneInput.match(regex3)){
                setInvalidNum(true)
                console.log('regexwork3 ELSE IF');
            }
            else{
                setDisable(true)
                setTrigger(true)
                setInvalidChar(false)
                reference.current.close();
                // const phone = parseInt(phoneInput)
                const phone = phoneInput
                const addressPayload = {
                    user_id:currentUser.user[0].user_id,
                    address,
                    phone,
                    recipent,
                    title,
                }
                //console.log('btmSheet ==> ',addressPayload);
                addressAdd(dispatch,addressPayload,setDisable,setTrigger)
            }
            
            
        }
        else{
            ToastAndroid.showWithGravityAndOffset(  
                "Please fill all fields",  
                ToastAndroid.LONG,  
                ToastAndroid.BOTTOM,
                25,
                50 
              ); 
        }
    }

    // const alphaNumericNameCheck = () =>{
    //     let regex1 = "[0-9*#+]+"
    //     let regex2 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    //     if(recipent.match(regex1) !== null){
    //         setInvalidChar(true)
    //         console.log('regexwork IF');
    //     }else if(recipent.match(regex2) !== null){
    //         setInvalidChar(true)
    //         console.log('regexwork ELSE IF');
    //     }
    //     else{
    //         setInvalidChar(false)
    //         console.log('regexwork else');
    //     }
    // }

    return (
        <ScrollView>

        <View style={styles.main}>
            <Text style={styles.inputLabelStyle}><MaterialCommunityIcons name='card-text-outline' color='gray' size={20} /> Address Title</Text>
            <TextInput selectionColor='black' style={styles.inputStyle} onChangeText={setTttle} value={title} maxLength={25}/>

            <Text style={styles.inputLabelStyle}><MaterialCommunityIcons name='account-outline' color='gray' size={20} /> Recipent Name</Text>
            {
                invalidChar ? (
                    <Text style={{color:"red"}}>Name cannot contain any number or special character</Text>

                ):(
                    null
                )
            }
            <TextInput selectionColor='black' style={styles.inputStyle} onChangeText={setRecipent} value={recipent} maxLength={35} />

            <Text style={styles.inputLabelStyle}><MaterialCommunityIcons name='map-marker-outline' color='gray' size={20} /> Address</Text>
            <TextInput selectionColor='black' style={styles.inputStyle} onChangeText={setAddress} value={address} maxLength={50}/>

            <Text style={styles.inputLabelStyle} ><MaterialCommunityIcons name='phone-outline' color='gray' size={20} /> Phone #</Text>
            {
                invalidNum ? (
                    <Text style={{color:"red"}}>Phone number cannot contain any special character</Text>

                ):(
                    null
                )
            }
            <TextInput selectionColor='black' style={styles.inputStyle} keyboardType="phone-pad" maxLength={11} onChangeText={setPhoneInput} value={phoneInput}/>

            <TouchableOpacity style={styles.btnStyle} onPress={handlePress} disabled={disable}>
                <Text style={styles.btnText}>Add Address</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}

export default AddressBottomSheet

const styles = StyleSheet.create({
    main: {
        paddingHorizontal: 15,
    },
    inputLabelStyle: {
        fontSize: 18,
        color:'#000'
    },
    inputStyle: {
        borderBottomWidth: 1,
        height: '10%',
        marginBottom: '5%',
        borderBottomColor: 'gray'
    },
    btnStyle: {
        backgroundColor: "#5A56E9",
        width: '50%',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: '4%',
        borderRadius: 13,
        marginTop: 3
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'whitesmoke'

    }
})