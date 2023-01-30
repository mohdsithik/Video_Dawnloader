import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, PermissionsAndroid,Image } from "react-native";
import { Appearance } from "react-native"; // for dark theme purpose
import RNFetchBlob from "rn-fetch-blob"; // for file access
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pasteUrl, setPasteUrl] = useState('');
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme(); //Indicates the current user preferred color scheme
    setIsDarkMode(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    })
    return () => {
      subscription.remove();
    };
  }, [])

  const darkmode = () => {
    setIsDarkMode((prev) => !prev);
  }

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Dawnload App Storage Permission',
          message:
            'Dawnload App needs access to your Storage ' +
            'so you can dawnload.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        dawnloadFile();

      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const verify = () => {
    if (pasteUrl != '')
      requestStoragePermission();
    else {
      alert('Enter the url again');
    }

  }
  const dawnloadFile=()=>{
      const{config,fs}=RNFetchBlob;
      const fileDir=fs.dirs.DownloadDir;
      date=new Date();
    
  config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache : true,
    addAndroidDownloads:{
      useDownloadManager:true,
      notification:true,
      path:fileDir+"/dawnload "+Math.floor(date.getDate()+date.getSeconds()/2)+".mp4"
    }
  })
  .fetch('GET', pasteUrl, {
    //some headers ..
  })
  .then((res) => {
    // the temp file path
    console.log('The file saved to ', res.path())
    alert("file Dawnloaded")
  })
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      <TouchableOpacity onPress={()=>darkmode()} style={styles.darkButton}>
      {/* <Text style={{color:isDarkMode ? 'white' : 'black' }}>darkmode</Text> */}
      <Image
        style={{width:40,height:40}}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/5365/5365412.png',
        }}
      />
      </TouchableOpacity>
     <View>
     
      
     </View>
      <View style={styles.contentBox}>
        <TextInput
          placeholder="Enter the URL"
          style={styles.textInput}
          onChangeText={(txt) => setPasteUrl(txt)}
          value={pasteUrl}
        />
        <TouchableOpacity style={styles.dawnloadButton} onPress={() => verify()}>
          <Text>click to Dawnload</Text>
        </TouchableOpacity >
      </View>
    </View>
  )

}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    //marginTop: '70%',
    
    
  },
  textInput: {
    borderWidth: 1,
    textAlign: 'center',
    margin: 20,
    borderRadius: 130,
    backgroundColor:'#EBD596'

  },
  dawnloadButton: {
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor:'#CADA73',
     
    

  },
  contentBox:{
    marginTop:'70%'
  },
  darkButton:{
    width:0,
    margin:15,
    marginLeft:320
  }
})
export default App;