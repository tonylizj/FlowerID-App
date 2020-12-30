/* eslint-disable react/jsx-filename-extension */
import { StatusBar } from 'expo-status-bar';
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from 'react-native';

import { LayersModel } from '@tensorflow/tfjs';

import styles from './styles'; // eslint-disable-line

import Loading from './loading/Loading';
import About from './loading/About';
import CameraPage from './camera/Camera';
import Prediction from './prediction/Prediction';

const App = () => {
  const [mode, setMode] = useState<string>('loading');

  const [model, setModel] = useState<LayersModel>();
  const [setupFinished, setSetupFinished] = useState<boolean>(false);

  const [imageUri, setImageUri] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');

  if (mode == 'loading') {
    return (
      <View style={styles.container}>
        <Loading setModel={setModel} setSetupFinished={setSetupFinished} setMode={setMode}/>
        <About setupFinished={setupFinished}/>
      </View>
    );
  }
  else if (mode == 'camera') {
    return (
      <CameraPage setImageBase64={setImageBase64} setImageUri={setImageUri} setMode={setMode} /> 
    );
  }
  else if (mode == 'prediction') {
    return (
      <Prediction model={model as LayersModel} imageBase64={imageBase64} imageUri={imageUri} setMode={setMode} />
    );
  }
};

export default App;
