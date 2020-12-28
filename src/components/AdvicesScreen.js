import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Header } from "react-native-elements";
import AppLoading from "expo-app-loading";
import { List } from "react-native-paper";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function AdvicesScreen() {
  //déclenche le setAdvices au chargement de la page pour récupérer les conseils stockés en BDD
  const [advices, setAdvices] = useState();

  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  const urlBack = "https://interviewcopprod.herokuapp.com";

  useEffect(() => {
    const getAdvices = async () => {
      const data = await fetch(`${urlBack}/advices`);
      const body = await data.json();
      if (body.result === true) {
        setAdvices(body.advices);
      }
    };
    getAdvices();
  }, []);

  if (!advices || !fontsLoaded) {
    return <AppLoading></AppLoading>;
  }

  let advicesList = advices.map((e, i) => (
    <List.Accordion title={e.title} key={i} titleStyle={styles.textbutton} style={styles.button} titleNumberOfLines={5}>
      <List.Item title={e.content} titleStyle={styles.advicetext} titleNumberOfLines={30} style={styles.adviceitem} />
    </List.Accordion>
  ));

  return (
    <View style={styles.container}>
      <Header
        barStyle="light-content"
        centerComponent={<Text style={styles.title}>Conseils</Text>}
        containerStyle={styles.topbar}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>{advicesList}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 320,
  },
  textbutton: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 29,
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.75,
  },
  advicetext: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 29,
    letterSpacing: 0.75,
  },
  adviceitem: {
    marginTop: 30,
  },
});

export default AdvicesScreen;
