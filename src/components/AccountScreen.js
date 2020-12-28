import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { Button, Header } from "react-native-elements";
import AppLoading from "expo-app-loading";
import { connect } from "react-redux";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
  Montserrat_100Thin,
} from "@expo-google-fonts/montserrat";
import { useIsFocused } from "@react-navigation/native";

function AccountScreen({ username, navigation }) {
  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  const [userScores, setUserScores] = useState();
  const [userTrophies, setUserTrophies] = useState();
  const [userIcops, setUserIcops] = useState();
  const [userPackage, setUserPackage] = useState();
  const [listErrors, setListErrors] = useState();
  const [listErrorsScores, setListErrorsScores] = useState();
  const [listErrorsTrophies, setListErrorsTrophies] = useState();
  const [listErrorsPackage, setListErrorsPackage] = useState();
  const [listErrorsIcops, setListErrorsIcops] = useState();
  const isFocused = useIsFocused();

  const urlBack = "https://interviewcopprod.herokuapp.com";

  //charge les scores, trophées, icops et package du user via le Back (via la BDD)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${urlBack}/accountfind-informationdatabase?usernameFromFront=${username}`);
      const body = await data.json();
      if (body.result === true) {
        setUserScores(body.scoresDataBase);
        setUserTrophies(body.trophiesDataBase);
        setUserIcops(body.icopsDataBase);
        setUserPackage(body.packageDataBase);
        setListErrorsScores(body.errorscores);
        setListErrorsTrophies(body.errortrophies);
        setListErrorsPackage(body.errorpackage);
        setListErrorsIcops(body.erroricops);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
  }, [isFocused]);

  if (!fontsLoaded) {
    //mécanique pour attendre que les polices soient chargées avant de générer le screen
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Header
          barStyle="light-content"
          centerComponent={<Text style={styles.title}>Mon compte</Text>}
          containerStyle={styles.topbar}
        />
        <ScrollView>
          <Text style={styles.title2}>Mes scores aux derniers entretiens</Text>
          {userScores && (
            <>
              {userScores.length > 0 ? (
                <View style={styles.container3}>
                  <Text style={styles.text}>{userScores[userScores.length - 3]} / 100</Text>
                  <Text style={styles.text}>{userScores[userScores.length - 2]} / 100</Text>
                  <Text style={styles.text}>{userScores[userScores.length - 1]} / 100</Text>
                </View>
              ) : (
                <Text style={styles.text}>{listErrorsScores}</Text>
              )}
            </>
          )}
          <Text style={styles.title2}>Mes trophées</Text>
          <View style={styles.container2}>
            {userTrophies && (
              <>
                {userTrophies.length > 0 ? (
                  userTrophies.map((trophies, i) => {
                    // vérification des nombres des trophées stockés précédemment dans l'état userTrophies pour pouvoir attribuer une image de trophée en fonction
                    let path;
                    if (trophies.number == 1) {
                      path = require("../assets/badgeparfait.png");
                    } else if (trophies.number == 2) {
                      path = require("../assets/badgepresqueparfait.png");
                    } else if (trophies.number == 3) {
                      path = require("../assets/badgeaparfaire.png");
                    }
                    return <Image key={i} source={path} style={styles.trophy} />;
                  })
                ) : (
                  <Text style={styles.text}>{listErrorsTrophies}</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.container3}>
            <View style={styles.formule}>
              <Text style={styles.title2}>Ma formule</Text>
              {userPackage ? (
                <>
                  <Text style={styles.text}>
                    Ma formule {userPackage.name} {"\n"} à {userPackage.price} €
                  </Text>
                  {(userPackage.name == "Free" || userPackage.name == "+") && (
                    <Button
                      title="Upgrade!"
                      titleStyle={styles.textbutton}
                      onPress={() => {
                        navigation.navigate("Shop");
                      }}
                      buttonStyle={styles.button}
                    />
                  )}
                </>
              ) : (
                <Text style={styles.text}>{listErrorsPackage}</Text>
              )}
            </View>
            <View style={styles.icops}>
              <Text style={styles.title2}>Mes iCops</Text>
              {userIcops ? (
                <>
                  <View style={styles.icopsimage}>
                    {userIcops.map((icops, i) => {
                      let icopimage;
                      if (icops.number == 1) {
                        icopimage = require("../assets/MikeChickenSmall.png");
                      } else if (icops.number == 2) {
                        icopimage = require("../assets/AgentToufSmall.png");
                      }
                      return <Image key={i} source={icopimage} style={styles.icop} />;
                    })}
                  </View>
                </>
              ) : (
                <Text style={styles.text}>{listErrorsIcops}</Text>
              )}
            </View>
          </View>
          {userPackage && (
            <View style={styles.chatview}>
              {userPackage.name == "Pro" && (
                <Button
                  title="Chat"
                  titleStyle={styles.textbutton}
                  onPress={() => {
                    navigation.navigate("ChatScreen");
                  }}
                  buttonStyle={styles.button}
                />
              )}
            </View>
          )}
          <Text style={styles.text}>{listErrors}</Text>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { username: state.username, score: state.score };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#FFFEFA",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  container3: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  formule: {
    width: "50%",
    alignItems: "center",
  },
  icops: {
    width: "50%",
    alignItems: "center",
  },
  icopsimage: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    textAlign: "center",
  },
  title2: {
    color: "#0773A3",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    color: "#0773A3",
    textAlign: "center",
    padding: 5,
  },
  trophy: {
    width: 100,
    height: 100,
    margin: 5,
  },
  icop: {
    width: 50,
    height: 50,
    margin: 5,
  },
  textbutton: {
    color: "#FFFEFE",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 29,
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.75,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 110,
  },
  chatview: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default connect(mapStateToProps, null)(AccountScreen);
