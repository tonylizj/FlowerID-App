import React, { useState, useEffect } from 'react';
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
import * as tf from '@tensorflow/tfjs';

import * as jpeg from 'jpeg-js';

import { StatusBar } from 'expo-status-bar';

import styles from '../styles'; // eslint-disable-line

const Prediction = (props: {model: LayersModel, imageBase64: string, imageUri: string, setMode: (mode: string) => void}) => {
  const [predicted, setPredicted] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string>();

  useEffect(() => {
    getPrediction();
  }, [])

  const imageToTensor = async (rawImageString: string): Promise<tf.Tensor4D> => {
    const jpegData = Buffer.from(rawImageString, 'base64');
    const { width, height, data } = jpeg.decode(jpegData);
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }
    return tf.tensor4d(buffer, [1, width, height, 3]);
  };

  const getPrediction = async (): Promise<void> => {
    const classes = ['Daisy', 'Dandelion', 'Rose', 'Sunflower', 'Tulip'];
    const imageTensor = await imageToTensor(props.imageBase64);
    if (props.model !== undefined) {
      const pred = props.model.predict(imageTensor) as tf.Tensor;
      const results = pred.dataSync();
      let currMaxIndex = 0;
      let currMax = -1;
      for (let i = 0; i < results.length; i += 1) {
        if (results[i] >= currMax) {
          currMax = results[i];
          currMaxIndex = i;
        }
      }
      setPrediction(classes[currMaxIndex]);
      setPredicted(true);
    } else {
      setPrediction('Error: model is undefined at prediction stage.');
      setPredicted(true);
    }
  };

  return (
    <View style={styles.container}>
      {predicted ? 
      <View>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
        <Image source={{ uri: props.imageUri }} style={styles.predictionImage} />
        <Text style={styles.smallGreenText}>This is an image of:</Text>
        <Text style={styles.greenText}>{prediction}</Text>
        <View style={styles.permsButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              props.setMode('camera');
            }}
          >
            <View style={styles.permsButton}>
              <Text>Return</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      :
      <View>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
        <Text style={styles.orangeText}>Predicting...</Text>
      </View>
      }
    </View>
  );
}

export default Prediction;