import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

const NewPasswordScreen = ({route,navigation}) => {
    const [pswd, setPswd] = useState('');
    const [confirmPswd, setConfirmPswd] = useState('');
    const {email} = route.params;
    const [disable, setDisable] = useState(false);
    const [overlay,setOverlay]=useState(false)
    const handleSubmit =async()=>{
        try {
            setDisable(true)
            setOverlay(true)
        const res = await axios.post('http://192.168.1.9:5000/sql/setNewPswd',{email:email , password:pswd})
        setDisable(false)
        setOverlay(false)
        navigation.navigate('Login');
        } catch (error) {
            console.log("errror==>",error)
            if(error == "AxiosError: Network Error"){
                ToastAndroid.showWithGravityAndOffset(  
                  "No network connectivity",  
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50 
                )
                setDisable(false)
                setOverlay(false)
            }
            setDisable(false)
      setOverlay(false)
        }
    }

    return (
        <>
        <Spinner
          visible={overlay}
        />
            <View style={styles.mainHeader}>
                <View style={styles.innerHeader}>
                    <View style={styles.innerHeader1}>

                        <Text style={styles.text}>New Password</Text>

                    </View>
                </View>
            </View>

            <View style={styles.descParent}>

                <View style={styles.desc}>
                    <Text style={styles.descText}>Set your new password. You will use this password to login in the future.</Text>
                </View>
            </View>

            <View style={styles.section1} >
                <View >
                    <View style={styles.emailBox}>
                        <Text style={styles.email}>Enter New Password</Text>
                    </View>
                    <TextInput
                        style={styles.inputEmail}
                        autoFocus={true}
                        secureTextEntry={true}
                        onChangeText={setPswd}
                        value={pswd}
                        placeholder='8 symbols atleast'
                    />
                </View>

                <View >
                    <View style={styles.emailBox}>
                        <Text style={styles.email}>Confirm Password</Text>
                    </View>
                    <TextInput
                        style={styles.inputEmail}
                        secureTextEntry={true}
                        onChangeText={setConfirmPswd}
                        value={confirmPswd}
                        placeholder='Confirm Password'
                    />

                </View>

                {
                     pswd.length>=8 && confirmPswd.length>=8 && pswd===confirmPswd?(
                        <TouchableOpacity style={styles.sendEmail_btn} disabled={disable} onPress={handleSubmit}>
                            <Text style={styles.sendEmail_btn_text}>Submit</Text>
                        </TouchableOpacity>
                    ):(
                        <View style={[styles.sendEmail_btn , {backgroundColor:'grey'}]} >
                            <Text style={styles.sendEmail_btn_text}>Submit</Text>
                        </View>
                    )
                }
            </View>

        </>
    )
}

export default NewPasswordScreen

const styles = StyleSheet.create({
    mainHeader: {
        // borderWidth: 2,
        borderColor: 'black',
        height: '12%',
        marginTop: "2%",
        // marginVertical:'1%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    innerHeader: {
        // borderWidth: 2,
        marginVertical: '2%',
        height: '80%',
        width: '100%',
        borderColor: 'red',
        flexDirection: 'row',
        alignItems: 'center'

    },
    innerHeader1: {
        width: '100%',
        height: '100%',
        // borderWidth: 2,
        borderColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        color: '#222222',
        fontSize: 23,
        fontWeight: '500'
    },
    backBtn: {
        fontSize: 25,
        color: '#888888',
        position: 'absolute',
        zIndex: 999,
        // top: 6,
        left: 15,
    },
    section1: {
        marginTop: '15%',

    },
    inputEmail: {

        height: 60,
        margin: 12,
        borderRadius: 30,
        borderColor: 'silver',
        borderWidth: 2,
        padding: 10,
        marginVertical: 25,


    },
    email: {
        fontSize: 20,
        fontWeight: '600',
        color: '#222222',

    },
    emailBox: {
        // borderWidth:2,
        alignItems: 'flex-start',
        marginLeft: 20,

    },
    sendEmail_btn: {
        width: "90%", height: 60, backgroundColor: "#5A56E9", borderRadius: 30, justifyContent: "center", alignItems: "center", alignSelf: "center", marginVertical: "10%",
        flexDirection: "row"
    },
    sendEmail_btn_text: {
        color: "white", fontWeight: "bold", fontSize: 17
    },

    desc: {
        // borderWidth:2,
        width: '90%',
    
      },
      descText: {
        fontSize: 18,
        textAlign: 'center'
    
      },
      descParent:{
        // borderWidth:2,
        alignItems:'center',
        marginTop:'10%',
        
      }
})