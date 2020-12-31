/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';

import styles from '../styles'; // eslint-disable-line

import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';

interface CameraPageProps {
  setImageUri: (uri: string) => void; // eslint-disable-line
  setMode: (mode: string) => void; // eslint-disable-line
}

const CameraPage = (props: CameraPageProps) => {
  const {
    setImageUri,
    setMode,
  } = props;

  const [capturing, setCapturing] = useState<boolean>(false);
  const [cameraRef, setCameraRef] = useState<Camera | null>();
  const [type, setType] = useState<string>(Camera.Constants.Type.back);
  const [flash, setFlash] = useState<string>(Camera.Constants.FlashMode.off);

  const cameraStyle = (): StyleProp<ViewStyle> => {
    const { width: dWidth } = Dimensions.get('window');

    return {
      flex: 0,
      height: (dWidth * 4) / 3,
      width: dWidth,
    };
  };

  const takePicture = async (): Promise<void> => {
    setCapturing(true);
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      setImageUri(uri);
      setCapturing(false);
      setMode('prediction');
    }
  };

  return (
    <View style={styles.preview}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
      {capturing ? (
        <View>
          <Text style={styles.orangeText}>
            Waiting on camera to take picture...
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.greenText}>
            Camera ready
          </Text>
        </View>
      )}
      <Camera
        style={cameraStyle()}
        type={type}
        flashMode={flash}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.insideCamera}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={type === Camera.Constants.Type.back
                ? styles.flipButton : styles.flipButtonActivated}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                );
              }}
            >
              <Text style={styles.flipText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.picButton}
              onPress={async () => takePicture()}
            >
              <Text style={styles.flipText}>Submit Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={flash === Camera.Constants.FlashMode.off
                ? styles.flipButton : styles.flipButtonActivated}
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off,
                );
              }}
            >
              <Text style={styles.flipText}>Flash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default CameraPage;
