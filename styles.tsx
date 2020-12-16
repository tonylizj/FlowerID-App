import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
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
  smallGreenText: {
    textAlign: "center",
    color: "green",
    fontSize: 14,
  },
  permsButton: {
    backgroundColor: "gray",
    margin: 10,
    width: 150,
    height: 60,
    //borderWidth: 5,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  permsButtonContainer: {
    alignItems: "center",
  },
  preview: { flex: 1, justifyContent: "center", backgroundColor: "black" },
  insideCamera: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  flipButton: {
    backgroundColor: "white",
    margin: 10,
    width: 60,
    height: 40,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  flipText: { fontSize: 18, margin: 10, color: "black" },
  picButton: { alignSelf: "center" },
  picText: {
    borderWidth: 2,
    borderRadius: 10,
    height: 80,
    width: 80,
    backgroundColor: "white",
  },
  predictionImage: {width: 400, height: 400},
});

export default styles;
