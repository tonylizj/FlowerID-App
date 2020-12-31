/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { StatusBar } from 'expo-status-bar';
import * as Permissions from 'expo-permissions'; // eslint-disable-line

import styles from '../styles'; // eslint-disable-line

interface LoadingPageProps {
  setModel: (model: LayersModel) => void; // eslint-disable-line
  setSetupFinished: (finished: boolean) => void; // eslint-disable-line
  setMode: (mode: string) => void; // eslint-disable-line
}

const LoadingPage = (props: LoadingPageProps) => {
  const { setModel, setSetupFinished, setMode } = props;

  const [TFReady, setTFReady] = useState<boolean>(false);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);

  const grantPermissions = async (): Promise<void> => {
    const res = await Permissions.askAsync(Permissions.CAMERA);
    if (res.status === 'granted') {
      setCameraPermission(true);
      setSetupFinished(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (
        (await Permissions.getAsync(Permissions.CAMERA)).status === 'granted'
      ) {
        setCameraPermission(true);
      }
      await tf.ready();
      setTFReady(true);
      const modelJSON = require('../../assets/model/model.json'); // eslint-disable-line
      const modelWeights = require('../../assets/model/weights.bin'); // eslint-disable-line
      const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights));
      setModel(loadedModel);
      setModelReady(true);
    };

    init();
  }, []);

  return (
    <>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
      {TFReady ? (
        <Text style={styles.greenText}>
          TensorFlow has loaded successfully.
        </Text>
      ) : (
        <Text style={styles.orangeText}>
          Waiting on TensorFlow to load...
        </Text>
      )}
      {modelReady ? (
        <Text style={styles.greenText}>
          FlowerID model has loaded successfully.
        </Text>
      ) : (
        <Text style={styles.orangeText}>
          Waiting on FlowerID model to load...
        </Text>
      )}
      {cameraPermission ? (
        <View>
          <Text style={styles.greenText}>
            Camera permissions have been granted.
          </Text>
          <View style={styles.permsButtonContainer}>
            {TFReady && modelReady ? (
              <TouchableOpacity
                onPress={() => {
                  setMode('camera');
                }}
              >
                <View style={styles.permsButton}>
                  <Text>Start FlowerID</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.permsButton}>
                  <Text>Please wait...</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.orangeText}>
            Camera permissions have not been granted.
          </Text>
          <View style={styles.permsButtonContainer}>
            {TFReady && modelReady ? (
              <TouchableOpacity
                onPress={() => {
                  grantPermissions();
                }}
              >
                <View style={styles.permsButton}>
                  <Text>Grant Permissions</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.permsButton}>
                  <Text>Please wait...</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default LoadingPage;
