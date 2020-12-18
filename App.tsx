import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

import { Camera } from "expo-camera";
import { LayersModel } from "@tensorflow/tfjs";
import * as Permissions from "expo-permissions";
import * as jpeg from "jpeg-js";
import * as IM from "expo-image-manipulator";

import styles from "./styles";

import aboutFIDText from "./assets/aboutFID";

const App = () => {
  const [TFReady, setTFReady] = useState<boolean>(false);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [model, setModel] = useState<LayersModel>();

  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [setupFinished, setSetupFinished] = useState<boolean>(false);

  const [cameraRef, setCameraRef] = useState<Camera | null>();
  const [type, setType] = useState<string>(Camera.Constants.Type.back);

  const [prediction, setPrediction] = useState<string>();
  const [imageUri, setImageUri] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [captured, setCaptured] = useState<boolean>(false);
  const [predicted, setPredicted] = useState<boolean>(false);
  const [readyForPrediction, setReadyForPrediction] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      if (
        (await Permissions.getAsync(Permissions.CAMERA)).status === "granted"
      ) {
        setCameraPermission(true);
      }

      await tf.ready();
      setTFReady(true);

      const modelJSON = require("./assets/model/model.json");
      const modelWeights = require("./assets/model/weights.bin");
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJSON, modelWeights)
      );

      setModel(model);
      setModelReady(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (captured && readyForPrediction) {
      getPrediction();
    }
  }, [captured, readyForPrediction]);

  const grantPermissions = async (): Promise<void> => {
    const res = await Permissions.askAsync(Permissions.CAMERA);
    if (res.status === "granted") {
      setCameraPermission(true);
    }
  };

  const cameraStyle = (): Object => {
    let { height: dHeight, width: dWidth } = Dimensions.get("window");
    dHeight = (dWidth * 4) / 3;

    return {
      flex: 0,
      height: dHeight,
      width: dWidth,
    };
  };

  const aboutFID = async () => {
    Alert.alert("About FlowerID", aboutFIDText, [{ text: "OK" }]);
  };

  const takePicture = async (): Promise<void> => {
    if (cameraRef) {
      let { uri } = await cameraRef.takePictureAsync();
      setCaptured(true);
      const { uri: newUri, base64 } = await IM.manipulateAsync(
        uri,
        [{ resize: { width: 200, height: 200 } }],
        { base64: true }
      );
      setImageBase64(base64 as string);
      setImageUri(newUri);
      setReadyForPrediction(true);
    }
  };

  const imageToTensor = async (
    rawImageString: string
  ): Promise<tf.Tensor4D> => {
    const jpegData = Buffer.from(rawImageString, "base64");
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
    if (!readyForPrediction) return;
    const classes = ["Daisy", "Dandelion", "Rose", "Sunflower", "Tulip"];
    var imageTensor = await imageToTensor(imageBase64);
    if (model !== undefined) {
      const pred = model.predict(imageTensor) as tf.Tensor;
      const results = pred.dataSync();
      let currMaxIndex = 0;
      let currMax = -1;
      for (let i = 0; i < results.length; ++i) {
        if (results[i] >= currMax) {
          currMax = results[i];
          currMaxIndex = i;
        }
      }
      setPrediction(classes[currMaxIndex]);
      setPredicted(true);
    } else {
      throw new Error("model is undefined");
    }
  };

  if (setupFinished) {
    if (captured) {
      if (predicted) {
        return (
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Image source={{ uri: imageUri }} style={styles.predictionImage} />
            <Text style={styles.smallGreenText}>This is an image of:</Text>
            <Text style={styles.greenText}>{prediction}</Text>
            <View style={styles.permsButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setPredicted(false);
                  setCaptured(false);
                  setReadyForPrediction(false);
                }}
              >
                <View style={styles.permsButton}>
                  <Text>Return</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.orangeText}>Predicting...</Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.preview}>
          <StatusBar style="auto" />
          <Camera
            style={cameraStyle()}
            type={type}
            ref={(ref) => {
              setCameraRef(ref);
            }}
          >
            <View style={styles.insideCamera}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text style={styles.flipText}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.picButton}
                onPress={async () => takePicture()}
              >
                <View style={styles.picText}></View>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.container}>
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
                    setSetupFinished(true);
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
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={styles.permsButton}>
                    <Text>Please wait...</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        )}
        <TouchableOpacity onPress={() => aboutFID()}>
          <View
            style={[
              styles.permsButton,
              {
                display:
                  TFReady && modelReady && cameraPermission ? "flex" : "none",
              },
            ]}
          >
            <Text>About FlowerID</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

export default App;
