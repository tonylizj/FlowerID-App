/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  View,
} from 'react-native';

import { LayersModel } from '@tensorflow/tfjs';

import styles from './styles'; // eslint-disable-line

import LoadingPage from './loading/Loading'; // eslint-disable-line
import AboutPage from './loading/About'; // eslint-disable-line
import CameraPage from './camera/Camera'; // eslint-disable-line
import PredictionPage from './prediction/Prediction'; // eslint-disable-line

const App = () => {
  const [mode, setMode] = useState<string>('loading');

  const [model, setModel] = useState<LayersModel>();
  const [setupFinished, setSetupFinished] = useState<boolean>(false);

  const [imageUri, setImageUri] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');

  if (mode === 'loading') {
    return (
      <View style={styles.container}>
        <LoadingPage setModel={setModel} setSetupFinished={setSetupFinished} setMode={setMode} />
        <AboutPage setupFinished={setupFinished} />
      </View>
    );
  }
  if (mode === 'camera') {
    return (
      <CameraPage setImageBase64={setImageBase64} setImageUri={setImageUri} setMode={setMode} />
    );
  }
  if (mode === 'prediction') {
    return (
      <PredictionPage
        model={model as LayersModel}
        imageBase64={imageBase64}
        imageUri={imageUri}
        setMode={setMode}
      />
    );
  }
  return null;
};

export default App;
