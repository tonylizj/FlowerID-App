import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

import { Camera, getPermissionsAsync } from "expo-camera";
import { LayersModel } from "@tensorflow/tfjs";
import * as Permissions from "expo-permissions";

import styles from "./styles";

const App = () => {
  const [capturing, setCapturing] = useState(false);
  const [TFReady, setTFReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [prediction, setPrediction] = useState([]);
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [model, setModel] = useState<LayersModel>();
  const [predicted, setPredicted] = useState(false);
  const [summary, setSummary] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraRef, setCameraRef] = useState<Camera | null>();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [setupFinished, setSetupFinished] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (
        (await Permissions.getAsync(Permissions.CAMERA)).status === "granted"
      ) {
        setCameraPermission(true);
      }

      const tfState = tf.ready();

      const modelJSON = require("./assets/model/model.json");
      const modelWeights = require("./assets/model/weights.bin");
      const modelState = tf.loadLayersModel(
        bundleResourceIO(modelJSON, modelWeights)
      );

      setTFReady(true);

      const [_, model] = await Promise.all([tfState, modelState]);

      model.summary();
      setModel(model);
      setModelReady(true);
    };

    initialize();
  }, []);

  const grantPermissions = async () => {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    if (status === "granted") {
      setCameraPermission(true);
    }
  };

  const cameraStyle = (dHeight: number, dWidth: number) => {
    return {
      flex: 0,
      height: dHeight,
      width: dWidth,
    };
  };

  if (setupFinished) {
    let { height: dHeight, width: dWidth } = Dimensions.get("window");
    dHeight = (dWidth * 4) / 3;

    console.log(dHeight, dWidth);

    return (
      <View style={styles.preview}>
        <Camera
          style={cameraStyle(dHeight, dWidth)}
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
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  console.log("photo", photo);
                }
              }}
            >
              <View style={styles.picText}></View>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
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
            <View style={{ alignItems: "center" }}>
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
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={() => grantPermissions()}>
                <View style={styles.permsButton}>
                  <Text>Grant</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
};

export default App;
