import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

import { Camera, getPermissionsAsync } from "expo-camera";
import { LayersModel } from "@tensorflow/tfjs";
import * as Permissions from "expo-permissions";

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

  if (setupFinished) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "gray",
                margin: 5,
                width: 80,
                height: 50,
                borderWidth: 5,
                borderRadius: 10,
                borderColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={{ fontSize: 18, margin: 10, color: "white" }}>
                Flip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  console.log("photo", photo);
                }
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 1,
                  backgroundColor: "transparent",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 1,
                    borderColor: "white",
                    height: 40,
                    width: 40,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  orangeText: {
    textAlign: "center",
    color: "orange",
    fontSize: 22,
  },
  greenText: {
    textAlign: "center",
    color: "green",
    fontSize: 22,
  },
  permsButton: {
    backgroundColor: "gray",
    margin: 10,
    width: 150,
    height: 60,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
});

export default App;
