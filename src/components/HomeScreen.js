import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Button, Header } from "react-native-elements";
import AppLoading from "expo-app-loading";
import { connect } from "react-redux";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function HomeScreen({ navigation, username }) {
  const logo = require("../assets/MikeChickenRight.png");
  const image = require("../assets/MikeChickenLeft.png");

  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Header
          barStyle="light-content"
          leftComponent={<Image source={logo} style={styles.logo} />}
          centerComponent={<Text style={styles.title}>InterviewCop</Text>}
          containerStyle={styles.topbar}
        />
        <Text style={styles.title2}> Bienvenue {username} !</Text>
        <Image source={image} style={styles.image} />
        <Text style={styles.text}> InterviewCop vous entraîne à passer des entretiens d'embauche. </Text>
        <Button
          title="Go !"
          titleStyle={styles.textbutton}
          onPress={() => {
            navigation.navigate("Interview");
          }}
          buttonStyle={styles.button}
        />
        <Button
          title="Des conseils !"
          titleStyle={styles.textbutton}
          onPress={() => {
            navigation.navigate("Advices");
          }}
          buttonStyle={styles.button}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { username: state.username };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFEFA",
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
  },
  title2: {
    color: "#0773A3",
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 40,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    color: "#0773A3",
    textAlign: "center",
    padding: 5,
  },
  textbutton: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 29,
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.75,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 140,
  },
  logo: {
    width: 20,
    height: 35,
    marginLeft: 70,
  },
  image: {
    width: 120,
    height: 230,
    marginTop: 30,
    marginBottom: 10,
    marginRight: 25,
  },
});

export default connect(mapStateToProps, null)(HomeScreen);
