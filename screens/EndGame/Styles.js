import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerGamePage: {
    backgroundColor: "#bfe555",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  tituloGamePage: {
    paddingTop: 50,
    fontSize: 30,
    color: "black",
    fontFamily: "serif",
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 20,
  },
  subTituloGamePage: {
    paddingTop: 50,
    fontSize: 25,
    color: "black",
    fontFamily: "serif",
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 20,
  },
  textGamePage: {
    fontSize: 20,
    color: "black",
    fontFamily: "serif",
    textAlign: "center",
    marginVertical: 10,
    paddingTop: 50,
    paddingBottom: 50,
  },
  totalGamePage: {
    paddingTop: 10,
    paddingBottom: 50,
    fontSize: 25,
    color: "black",
    fontFamily: "serif",
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 20,
  },
  buttonInsertDataInicial: {
    backgroundColor: "black",
    borderRadius: 10,
    width: 140,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  labelGameButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    fontFamily: "serif",
    textAlign: "center",
  },
  viewRowButtons: {
    flexDirection: "row",
  },
});

export default styles;
