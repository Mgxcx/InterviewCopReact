import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";
import { Button, Header } from "react-native-elements";
import { TextInput } from "react-native-paper";
import AppLoading from "expo-app-loading";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import socketIOClient from "socket.io-client";
import Svg, { Path } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

const urlBack = "https://interviewcopprod.herokuapp.com";

const socket = socketIOClient(urlBack);

function ChatScreen({ username, navigation }) {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [listMessage, setListMessage] = useState([]);

  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  useEffect(() => {
    socket.emit("sendWelcomeMessage", { currentMessage: "", username });
  }, []);

  useEffect(() => {
    socket.on("welcomeMessage", (newMessage) => {
      var regexSmile = /:\)/;
      var newStr = newMessage.currentMessage.replace(regexSmile, "\u263A");
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
    socket.on("sendMessageToAll", (newMessage) => {
      var regexSmile = /:\)/;
      var regexSad = /:\(/;
      var regexLangue = /:\p/;
      var regexFuck = /fuck[a-z]*/i;
      var newStr = newMessage.currentMessage
        .replace(regexSmile, "\u263A")
        .replace(regexSad, "\u2639")
        .replace(regexLangue, "\uD83D\uDE1B")
        .replace(regexFuck, "\u2022\u2022\u2022");
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
  }, [listMessage]);

  const affichageMessages = listMessage.map((e, i) => {
    if (e.username != username) {
      return (
        <View key={i} style={styles.icoppresentation2}>
          <View style={[styles.bubble, styles.bubbleIn]}>
            <View style={[styles.balloon, { backgroundColor: "#0773A3" }]}>
              <Text style={styles.text}>{e.currentMessage}</Text>
              <Text style={styles.smalltext}>{e.username}</Text>
              <View style={[styles.arrowContainer, styles.arrowLeftContainer]}>
                <Svg
                  style={styles.arrowLeft}
                  width={moderateScale(15.5, 0.6)}
                  height={moderateScale(17.5, 0.6)}
                  viewBox="32.485 17.5 15.515 17.5"
                  enable-background="new 32.485 17.5 15.515 17.5"
                >
                  <Path
                    d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                    fill="#0773A3"
                    x="0"
                    y="0"
                  />
                </Svg>
              </View>
            </View>
          </View>
        </View>
      );
    } else
      return (
        <View key={i} style={styles.icoppresentation}>
          <View style={[styles.bubble, styles.bubbleOut]}>
            <View style={[styles.balloon, { backgroundColor: "#4FA2C7" }]}>
              <Text style={styles.text}>{e.currentMessage}</Text>
              <Text style={styles.smalltext}>{e.username}</Text>
              <View style={[styles.arrowContainer, styles.arrowRightContainer]}>
                <Svg
                  style={styles.arrowRight}
                  width={moderateScale(15.5, 0.6)}
                  height={moderateScale(17.5, 0.6)}
                  viewBox="32.485 17.5 15.515 17.5"
                  enable-background="new 32.485 17.5 15.515 17.5"
                >
                  <Path d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z" fill="#4FA2C7" x="0" y="0" />
                </Svg>
              </View>
            </View>
          </View>
        </View>
      );
  });

  if (!fontsLoaded) {
    return <AppLoading></AppLoading>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        barStyle="light-content"
        leftComponent={
          <Button
            icon={<Ionicons name="ios-arrow-back" size={24} color="#FFFEFA" />}
            onPress={() => {
              navigation.navigate("AccountScreen");
            }}
            buttonStyle={styles.button}
          />
        }
        centerComponent={<Text style={styles.title}>Chat</Text>}
        containerStyle={styles.topbar}
      />
      <ScrollView style={{ flex: 1 }}>{affichageMessages}</ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <TextInput
          label="Tapez votre message ici"
          value={currentMessage}
          onChangeText={(e) => setCurrentMessage(e)}
          style={styles.input}
          mode="outlined"
        />
        <Button
          icon={<FontAwesome name="send-o" size={24} color="#FFFEFA" />}
          iconRight
          title="Envoyer  "
          buttonStyle={{ backgroundColor: "#0773A3" }}
          type="solid"
          onPress={() => {
            socket.emit("sendMessage", { currentMessage, username });
            setCurrentMessage("");
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
  },
  input: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    width: "100%",
    alignSelf: "center",
  },
  icoppresentation: {
    flexDirection: "row",
    flex: 1.5,
    alignSelf: "flex-end",
  },
  icoppresentation2: {
    flexDirection: "row",
    flex: 1.5,
    alignSelf: "flex-start",
  },
  bubble: {
    marginVertical: moderateScale(7, 2),
    width: 230,
  },
  bubbleIn: {
    marginLeft: 20,
  },
  bubbleOut: {
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    color: "#FFFEFE",
    padding: 5,
  },
  smalltext: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    color: "#FFFEFE",
    textAlign: "right",
    padding: 5,
  },
  button: {
    backgroundColor: "transparent",
  },
});

export default connect(mapStateToProps, null)(ChatScreen);
