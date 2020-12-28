import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, KeyboardAvoidingView } from "react-native";
import { Button, Header } from "react-native-elements";
import { TextInput } from "react-native-paper";
import AppLoading from "expo-app-loading";
import DropDownPicker from "react-native-dropdown-picker";
import { connect } from "react-redux";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function LoginScreen({ navigation, onSubmitUsername }) {
  //états liés au Sign-Up
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const logo = require("../assets/MikeChickenRight.png");
  const [listErrorsSignup, setListErrorsSignup] = useState([]); //les messages d'erreur sont transmis par le Back

  //états liés au Sign-In
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [listErrorsSignin, setListErrorsSignin] = useState(); //les messages d'erreur sont transmis par le Back

  const [userExists, setUserExists] = useState(false); //état lié à la vérification de l'existence du user dans la BDD

  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  const urlBack = "https://interviewcopprod.herokuapp.com";

  //Process SignUp : se déclenche via le bouton connecter du "pas encore de compte?"
  //interroge la BDD via le Back, le Back vérifie que le user est bien créé dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignup = async () => {
    const data = await fetch(`${urlBack}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signUpUsername}&passwordFromFront=${signUpPassword}&secret_question=${secretQuestion}&secret_question_answer=${answer}`,
    });

    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signUpUsername);
    } else {
      setListErrorsSignup(body.error);
    }
  };

  //Process SignIn : se déclenche via le bouton connecter du "déjà un compte?"
  //interroge la BDD via le Back, le Back vérifie que le user existe dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignin = async () => {
    const data = await fetch(`${urlBack}/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signInUsername}&passwordFromFront=${signInPassword}`,
    });

    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signInUsername);
    } else {
      setListErrorsSignin(body.error);
    }
  };

  //déclenche la redirection vers HomeScreen si le SignIn ou le SignUp a bien réussi
  useEffect(() => {
    if (userExists) {
      navigation.navigate("PagesTab");
    }
  }, [userExists]);

  if (!fontsLoaded) {
    //mécanique pour attendre que les polices soient chargées avant de générer le screen
    return <AppLoading />;
  } else {
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
        <Header
          barStyle="light-content"
          leftComponent={<Image source={logo} style={styles.logo} />}
          centerComponent={<Text style={styles.title}>InterviewCop</Text>}
          containerStyle={styles.topbar}
        />
        <ScrollView>
          <View style={styles.signin}>
            <Text style={styles.text}>Déjà un compte ?</Text>

            <TextInput
              placeholder="Username"
              label="Username"
              onChangeText={(username) => setSignInUsername(username)}
              value={signInUsername}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              placeholder="Mot de passe"
              label="Mot de passe"
              value={signInPassword}
              onChangeText={(password) => setSignInPassword(password)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={true}
            />

            <Text
              style={styles.smalltext}
              onPress={() => {
                navigation.navigate("PasswordRecovery");
              }}
            >
              Mot de passe oublié ?
            </Text>
            <Text style={styles.text2}>{listErrorsSignin}</Text>
            <Button
              title="Se connecter"
              titleStyle={styles.textbutton}
              type="solid"
              buttonStyle={styles.button}
              onPress={() => {
                handleSubmitSignin();
              }}
            />
          </View>

          <View style={styles.signup}>
            <Text style={styles.text}>Pas encore de compte ?</Text>

            <TextInput
              placeholder="Username"
              label="Username"
              onChangeText={(username) => setSignUpUsername(username)}
              value={signUpUsername}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              placeholder="Mot de passe"
              label="Mot de passe"
              onChangeText={(password) => setSignUpPassword(password)}
              value={signUpPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={true}
            />

            <DropDownPicker
              items={[
                {
                  label: "Quel est le nom de votre premier animal de compagnie?",
                  value: "Quel est le nom de votre premier animal de compagnie?",
                },
                {
                  label: "Quelle est la date de naissance de votre mère?",
                  value: "Quelle est la date de naissance de votre mère?",
                },
                {
                  label: "Quel est votre plat favori?",
                  value: "Quel est votre plat favori?",
                },
              ]}
              defaultIndex={0}
              placeholder="Choisissez une question secrète"
              style={styles.colordropdown}
              dropDownStyle={styles.colordropdown}
              containerStyle={styles.containerdropdown}
              labelStyle={styles.labeldropdown}
              onChangeItem={(item) => setSecretQuestion(item.value)}
              value={secretQuestion}
            />

            <TextInput
              placeholder="Réponse"
              label="Réponse"
              onChangeText={(answer) => setAnswer(answer)}
              value={answer}
              style={styles.input}
              mode="outlined"
            />

            <Text style={styles.text2}>{listErrorsSignup}</Text>

            <Button
              title="Se connecter"
              titleStyle={styles.textbutton}
              type="solid"
              buttonStyle={styles.button}
              onPress={() => {
                handleSubmitSignup();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitUsername: function (username) {
      dispatch({ type: "saveUsername", username });
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFEFA",
  },
  signin: {
    flex: 2.3,
    alignItems: "center",
  },
  signup: {
    flex: 3,
    alignItems: "center",
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
  },
  logo: {
    width: 20,
    height: 35,
    marginLeft: 70,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    color: "#0773A3",
  },
  text2: {
    marginTop: 2,
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    color: "#0773A3",
  },
  smalltext: {
    fontFamily: "Montserrat_400Regular_Italic",
    fontSize: 13,
    color: "#0773A3",
    marginTop: 5,
  },
  button: {
    marginBottom: 10,
    backgroundColor: "#0773A3",
    borderRadius: 15,
    width: 140,
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
  containerdropdown: {
    height: 40,
    width: 220,
    marginTop: 20,
  },
  labeldropdown: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    color: "#0773A3",
  },
  colordropdown: {
    borderColor: "#0773A3",
    backgroundColor: "#FFFEFA",
  },
  input: {
    marginTop: 10,
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    backgroundColor: "#FFFEFA",
    color: "#0773A3",
    height: 40,
    width: 220,
  },
});

export default connect(null, mapDispatchToProps)(LoginScreen);
