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
    fontSize: 18,
  },
  greenText: {
    textAlign: "center",
    color: "green",
    fontSize: 18,
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
    margin: 0,
    width: 50,
    height: 30,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  flipText: { fontSize: 12, color: "black" },
  picButton: { alignSelf: "center" },
  picText: {
    borderWidth: 2,
    borderRadius: 10,
    height: 60,
    width: 150,
    backgroundColor: "white",
  },
  predictionImage: {width: 400, height: 400},
});

export default styles;
