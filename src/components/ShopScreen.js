import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import { Button, Header, CheckBox, Divider, Overlay } from "react-native-elements";
import AppLoading from "expo-app-loading";
import { TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function ShopScreen({ username, navigation }) {
  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisible2, setOverlayVisible2] = useState(false);
  const [userPackage, setUserPackage] = useState();
  const [packageId, setPackageId] = useState();
  const [price, setPrice] = useState();
  const [usernameCard, setUsernameCard] = useState();
  const [creditCardNumbers, setCreditCardNumbers] = useState();
  const [expirationMonth, setExpirationMonth] = useState();
  const [expirationYear, setExpirationYear] = useState();
  const [CVC, setCVC] = useState();
  const [errorInformationPayment, setErrorInformationPayment] = useState();
  const [errorPayment, setErrorPayment] = useState();
  const [listErrors, setListErrors] = useState();
  const isFocused = useIsFocused();

  const urlBack = "https://interviewcopprod.herokuapp.com";

  //charge le package du user via le Back (via la BDD)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${urlBack}/shopfind-package?usernameFromFront=${username}`);
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
    setUsernameCard("");
    setCreditCardNumbers("");
    setExpirationMonth("");
    setExpirationYear("");
    setCVC("");
  }, [isFocused]);

  //se déclenche quand le user veut changer de package et doit payer
  useEffect(() => {
    packageId && toggleOverlay();
  }, [packageId]);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlay2 = () => {
    setOverlayVisible2(!overlayVisible2);
  };

  const handleSubmitPay = () => {
    let payment = false;
    const isCardValid = {
      cardnumbers: "4242424242424242",
      expMonth: 10,
      expYear: 21,
      cvc: "888",
    };
    if (usernameCard && creditCardNumbers && expirationMonth && expirationYear && CVC) {
      setErrorInformationPayment("");

      if (
        isCardValid.cardnumbers == creditCardNumbers &&
        isCardValid.expMonth == expirationMonth &&
        isCardValid.expYear == expirationYear &&
        isCardValid.cvc == CVC
      ) {
        toggleOverlay();
        toggleOverlay2();
        payment = true;
        setErrorPayment("");
      } else {
        setErrorPayment("Le paiement a échoué");
      }

      console.log("paiement true ou false", payment);
      if (payment == true) {
        console.log("Paiement", username, packageId);
        const fetchData2 = async () => {
          const data = await fetch(
            `${urlBack}/shopupdate-package?usernameFromFront=${username}&packageIdFromFront=${packageId}`
          );
          const body = await data.json();
          if (body.result === true) {
            setUserPackage(body.packageDataBase);
          } else {
            setListErrors(body.error);
          }
        };
        fetchData2();
      }
    } else {
      setErrorInformationPayment("Tous les champs n'ont pas été remplis");
    }
  };

  const handleSubmitChangePackage = (idPackage) => {
    const fetchData3 = async () => {
      const data = await fetch(
        `${urlBack}/shopupdate-package?usernameFromFront=${username}&packageIdFromFront=${idPackage}`
      );
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData3();
  };

  if (!fontsLoaded) {
    //mécanique pour attendre que les polices soient chargées avant de générer le screen
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Header
          barStyle="light-content"
          centerComponent={<Text style={styles.title}>Shop</Text>}
          containerStyle={styles.topbar}
        />

        <ScrollView>
          <View style={styles.scrollview}>
            {userPackage ? (
              <>
                <Text style={styles.title2}>La formule Free à 0 € {userPackage.name == "Free" && "(actuelle)"}</Text>
                <CheckBox
                  title="Parcours entretien illimité"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                {userPackage.name != "Free" && (
                  <Button
                    title="Je la veux!"
                    titleStyle={styles.textbutton}
                    onPress={() => handleSubmitChangePackage("5fd776ffe2b67bdc3438888b")}
                    buttonStyle={styles.button}
                  />
                )}
                <Divider style={styles.divider} />
                <Text style={styles.title2}>La formule + à 9 € {userPackage.name == "+" && "(actuelle)"}</Text>
                <CheckBox
                  title="Parcours entretien illimité"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                <CheckBox
                  title="Rapports approfondis"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                {userPackage.name != "+" && (
                  <Button
                    title="Je la veux!"
                    titleStyle={styles.textbutton}
                    onPress={() => {
                      userPackage.name == "Free" && setPrice("Payer 9,00 €");
                      userPackage.name == "Free" && setPackageId("5fd777ddab2c4ddc51207488");
                      userPackage.name == "Pro" && handleSubmitChangePackage("5fd777ddab2c4ddc51207488");
                    }}
                    buttonStyle={styles.button}
                  />
                )}
                <Divider style={styles.divider} />
                <Text style={styles.title2}>La formule Pro à 19 € {userPackage.name == "Pro" && "(actuelle)"}</Text>
                <CheckBox
                  title="Parcours entretien illimité"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                <CheckBox
                  title="Rapports approfondis"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                <CheckBox
                  title="Suivi avec un coach"
                  checked={true}
                  containerStyle={styles.checkbox}
                  textStyle={styles.text}
                  checkedColor="#0773A3"
                  uncheckedColor="#4FA2C7"
                />
                {userPackage.name != "Pro" && (
                  <Button
                    title="Je la veux!"
                    titleStyle={styles.textbutton}
                    onPress={() => {
                      setPrice("Payer 19,00 €");
                      setPackageId("5fd77864b6d0a5dc87b398db");
                    }}
                    buttonStyle={styles.button}
                  />
                )}
              </>
            ) : (
              <Text style={styles.text}>{listErrors}</Text>
            )}

            <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
              <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <ScrollView style={styles.overlay}>
                  <Text style={styles.title2}>Payer par carte</Text>
                  <TextInput
                    placeholder="Nom du titulaire de la carte"
                    label="Nom du titulaire de la carte"
                    onChangeText={(usernamecard) => setUsernameCard(usernamecard)}
                    value={usernameCard}
                    style={styles.input}
                    mode="outlined"
                  />
                  <TextInput
                    placeholder="Numéros de la carte"
                    label="Numéros de la carte"
                    onChangeText={(creditcardnumbers) => setCreditCardNumbers(creditcardnumbers)}
                    value={creditCardNumbers}
                    style={styles.input}
                    mode="outlined"
                  />
                  <TextInput
                    placeholder="Mois d'expiration"
                    label="Mois d'expiration"
                    onChangeText={(expirationmonth) => setExpirationMonth(expirationmonth)}
                    value={expirationMonth}
                    style={styles.input}
                    mode="outlined"
                  />
                  <TextInput
                    placeholder="Année d'expiration"
                    label="Année d'expiration"
                    onChangeText={(expirationyear) => setExpirationYear(expirationyear)}
                    value={expirationYear}
                    style={styles.input}
                    mode="outlined"
                  />
                  <TextInput
                    placeholder="CVC"
                    label="CVC"
                    onChangeText={(cvc) => setCVC(cvc)}
                    value={CVC}
                    style={styles.input}
                    mode="outlined"
                  />

                  <Text style={styles.text}>{errorInformationPayment}</Text>
                  <Button
                    title={price}
                    titleStyle={styles.textbutton2}
                    buttonStyle={styles.button2}
                    onPress={() => {
                      handleSubmitPay();
                    }}
                  />
                  <Text style={styles.text}>{errorPayment}</Text>
                </ScrollView>
              </KeyboardAvoidingView>
            </Overlay>

            <Overlay isVisible={overlayVisible2} overlayStyle={styles.overlay}>
              <View style={styles.overlay2}>
                <Text style={styles.title2}>
                  Bravo {username} !{"\n"} Ton paiement s'est bien passé, {"\n"}
                  et tu as désormais accès à plus de fonctionnalités !
                </Text>
                <Button
                  title="OK"
                  titleStyle={styles.textbutton2}
                  buttonStyle={styles.button}
                  onPress={() => {
                    toggleOverlay2();
                    navigation.navigate("Account");
                  }}
                />
              </View>
            </Overlay>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFEFA",
  },
  scrollview: {
    alignItems: "center",
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
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    color: "#0773A3",
    padding: 5,
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
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
  textbutton2: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 29,
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.75,
  },
  button: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 110,
    alignSelf: "center",
  },
  button2: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 180,
    alignSelf: "center",
  },
  checkbox: {
    width: 250,
    padding: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  divider: {
    height: 2,
    backgroundColor: "#0773A3",
    width: 350,
  },
  overlay: {
    backgroundColor: "#FFFEFA",
    width: "90%",
    height: "85%",
    borderRadius: 20,
    opacity: 0.95,
    margin: 40,
    alignSelf: "center",
  },
  overlay2: {
    backgroundColor: "#FFFEFA",
    width: "90%",
    height: "85%",
    borderRadius: 20,
    opacity: 0.95,
    margin: 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  input: {
    marginTop: 10,
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    backgroundColor: "#FFFEFA",
    color: "#0773A3",
    height: 40,
    width: 280,
  },
});

export default connect(mapStateToProps, null)(ShopScreen);
