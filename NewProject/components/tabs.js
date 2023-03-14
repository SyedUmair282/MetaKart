import {View, Text, ScrollView,TouchableOpacity,StyleSheet} from 'react-native';
import React,{useState,useEffect} from 'react';
import { Skeleton,NativeBaseProvider } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';



const Tabs = ({hierarchy_id,setHier_id,setHeading,setId,navigation,dont_navigate}) => {
  const [data, setData] = useState([{category_name:"All"}]);
  const [num,setNum]=useState(0);
  const [skeleton,setSkeleton]=useState(false)

  const [overlay,setOverlay]=useState(false);
  const [disable,setDisable]=useState(false);

  const getTab=async(v,index)=>{
    if(dont_navigate){
      setNum(index);
      setHier_id(v.hierarchy_id)
      console.log("all=>",v)
    }
    else{
      navigation.navigate('More_subcategory',{data:v})
    }
    // setHeading(value)
    
  }

  const getsubCategories=async()=>{
    setData([{category_name:"All"}])
    try {
      setSkeleton(true)
    const datas=await axios.post(`http://192.168.1.9:5000/sql/getSubCategories`, {hierarchy_id})
    const res=datas.data
    //console.log("tabs data==>",res)
    for (let i = 0; i < res.length; i++) {
      setData((data)=>[...data,res[i]])
    }
    setSkeleton(false)
    } catch (error) {
      console.log("some tab==>",error)
    }
    
  }
  useEffect(() => {
    getsubCategories();
  }, [])
  
  
  return (
    <NativeBaseProvider>

      {skeleton===false?
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{borderBottomWidth:0.5,borderBottomColor:"#f2f2f2",backgroundColor:"#f2f2f2"}}>
        <View
        style={{
          width: '100%',flexDirection: 'row', padding: 7
        }}>
          <Spinner
          visible={overlay}
          />
          {data.map((v, i) => {
            return (
              <TouchableOpacity key={i} disabled={disable} activeOpacity={0.9} style={num == i ? Style.tabs : Style.tabs2} 
              onPress={()=>{
                setDisable(true)
                setOverlay(true)
              setTimeout(() => {
                getTab(v,i)
                setOverlay(false)
                setDisable(false)
              }, 1000);
                
                }}
              >
                <Text style={num == i ? Style.text : Style.text2}>{v.category_name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        </ScrollView>
        :<View
    style={{
      width: '100%', flexDirection: 'row', padding: 7, justifyContent:"space-between"
    }}>


    <View activeOpacity={0.9} >
      <Skeleton  borderColor="coolGray.200" mb="3" w="63" h="9" rounded="10" startColor="amber.300" />
    </View>


    <View activeOpacity={0.9} >
      <Skeleton  borderColor="coolGray.200" mb="3" w="63" h="9" rounded="10" startColor="coolGray.300" />
    </View>

    <View activeOpacity={0.9} >
      <Skeleton  borderColor="coolGray.200" mb="3" w="63" h="9" rounded="10" startColor="coolGray.300" />
    </View>


    <View activeOpacity={0.9} >
      <Skeleton  borderColor="coolGray.200" mb="3" w="63" h="9" rounded="10" startColor="coolGray.300" />
    </View>


    <View activeOpacity={0.9} >
      <Skeleton  borderColor="coolGray.200" mb="3" w="63" h="9" rounded="10" startColor="coolGray.300" />
    </View>


  </View>
      }
      </NativeBaseProvider>
  );
};

export default Tabs;


const Style=StyleSheet.create({
  tabs: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor:"#5A56E9",
  },
  tabs2: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor:"lightgray",
  },
  text:{
    color:"white"
  },
  text2:{
    color:"black"
  }
})
