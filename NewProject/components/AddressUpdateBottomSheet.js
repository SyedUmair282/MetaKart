import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateAddress} from '../redux/AddressRedux';
import {useDispatch, useSelector} from 'react-redux';
import {addressUpdate} from '../redux/apiCalls';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const AddressUpdateBottomSheet = ({
  reference,
  addressToUpdate,
  trigger,
  setTrigger,
}) => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [title, setTitle] = useState(addressToUpdate.address_title);
  const [recipent, setRecipent] = useState(addressToUpdate.recipent);
  const [address, setAddress] = useState(addressToUpdate.address_line);
  const [phoneInput, setPhoneInput] = useState(addressToUpdate.mobile);
  const [invalidChar, setInvalidChar] = useState(false);
  const address_id = addressToUpdate.address_id;

  const handlePress = () => {
    let regex1 = '[0-9*#+]+';
    let regex2 = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (recipent.match(regex1) !== null) {
      setInvalidChar(true);
      console.log('regexwork IF');
    } else if (recipent.match(regex2) !== null) {
      setInvalidChar(true);
      console.log('regexwork ELSE IF');
    } else {
      setInvalidChar(false);
      reference.current.close();
      // const phone = parseInt(phoneInput)
      const phone = phoneInput;
      const payload = {
        address,
        phone,
        recipent,
        title,
      };
      addressUpdate(dispatch, {address_id, payload},setTrigger);
      // navigate.navigate('AddressBook')
      //setTrigger(!trigger);
    }
  };

  //   const handlePress = () => {
  //     reference.current.close();
  //     const phone = phoneInput;
  //     const payload = {
  //       address,
  //       phone,
  //       recipent,
  //       title,
  //     };
  //     addressUpdate(dispatch, {address_id, payload});
  //     // navigate.navigate('AddressBook')
  //     setTrigger(!trigger);
  //   };

  return (
    <View style={styles.main}>
      <Text style={styles.inputLabelStyle}>
        <MaterialCommunityIcons
          name="card-text-outline"
          color="gray"
          size={20}
        />{' '}
        Address Title
      </Text>
      <TextInput
        selectionColor="black"
        style={styles.inputStyle}
        onChangeText={setTitle}
        value={title}
        maxLength={25}
      />

      <Text style={styles.inputLabelStyle}>
        <MaterialCommunityIcons name="account-outline" color="gray" size={20} />{' '}
        Recipent Name
      </Text>
      {invalidChar ? (
        <Text style={{color: 'red'}}>
          Name cannot contain any number or special character
        </Text>
      ) : null}
      <TextInput
        selectionColor="black"
        style={styles.inputStyle}
        onChangeText={setRecipent}
        value={recipent}
        maxLength={25}
      />

      <Text style={styles.inputLabelStyle}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          color="gray"
          size={20}
        />{' '}
        Address
      </Text>
      <TextInput
        selectionColor="black"
        style={styles.inputStyle}
        onChangeText={setAddress}
        value={address}
        maxLength={25}
      />

      <Text style={styles.inputLabelStyle}>
        <MaterialCommunityIcons name="phone-outline" color="gray" size={20} />{' '}
        Phone #
      </Text>
      <TextInput
        selectionColor="black"
        style={styles.inputStyle}
        keyboardType="phone-pad"
        maxLength={11}
        onChangeText={setPhoneInput}
        value={phoneInput}
      />

      <TouchableOpacity style={styles.btnStyle} onPress={handlePress}>
        <Text style={styles.btnText}>Update Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressUpdateBottomSheet;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
  },
  inputLabelStyle: {
    fontSize: 18,
    color: '#000',
  },
  inputStyle: {
    borderBottomWidth: 1,
    height: '10%',
    marginBottom: '5%',
    borderBottomColor: 'gray',
  },
  btnStyle: {
    backgroundColor: '#5A56E9',
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: '4%',
    borderRadius: 13,
    marginTop: 3,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'whitesmoke',
  },
});
