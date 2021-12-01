
import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  return (
    <SafeAreaView >
      <TouchableOpacity  onPress={selectImage}>
        <Text >Pick an image</Text>
      </TouchableOpacity>
      <View >
        {image !== null ? (
          <Image source={{ uri: image.uri }} />
        ) : null}
        {uploading ? (
          <View >
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
          <TouchableOpacity onPress={uploadImage}>
            <Text>Upload image</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
  function selectImage() {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: ''
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.errorMessage) {
        console.log('User tapped custom button: ', response.errorMessage);
      } else {
        const source = { uri: response.assets };
        console.log(">>>  ",source.uri[0].uri);
        setImage(source.uri[0]);
        
      }
    });
  };
  
  async function uploadImage () {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile('file:///storage/emulated/0/Download/Pocket_Watch_a41_-_65s_-_4k_res.mp4');
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
  };
}


