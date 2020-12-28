import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { Button, Header } from "react-native-elements";
import AppLoading from "expo-app-loading";
import DropDownPicker from "react-native-dropdown-picker";
import { TextInput } from "react-native-paper";

import { connect } from "react-redux";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function PasswordRecoveryScreen({ navigation, onSubmitUsername }) {
  const [username, setUsername] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const logo = require("../assets/MikeChickenRight.png");
  const [listErrorsPasswordRecovery, setListErrorsPasswordRecovery] = useState([]); //les messages d'erreur sont transmis par le Back
  const [listErrorsNewPassword, setListErrorsNewPassword] = useState([]); //les messages d'erreur sont transmis par le Back

  const [userQuestionAndAnswer, setUserQuestionAndAnswer] = useState(false); //état lié à la vérification de la question secrète choisie et la réponse du user dans la BDD
  const [PasswordChange, setPasswordChange] = useState("");

  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  const urlBack = "https://interviewcopprod.herokuapp.com";

  //Process PasswordRecovery : se déclenche via le bouton valider de la récupération de mot de passe
  //interroge la BDD via le Back, le Back vérifie que la question secrète choisie et la réponse correspondent au User et renvoie un message d'erreur le cas échéant
  const handleSubmitPasswordRecovery = async () => {
    const data = await fetch(`${urlBack}/password-recovery`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&secret_questionFromFront=${secretQuestion}&secret_question_answerFromFront=${answer}`,
    });

    const body = await data.json();

    if (body.result === true) {
      setUserQuestionAndAnswer(true);
    } else {
      setListErrorsPasswordRecovery(body.error);
    }
  };
  let newPasswordView;
  if (userQuestionAndAnswer) {
    newPasswordView = (
      <View style={styles.newpassword}>
        <TextInput
          placeholder="Nouveau mot de passe"
          label="Nouveau mot de passe"
          onChangeText={(PasswordChange) => setPasswordChange(PasswordChange)}
          value={PasswordChange}
          style={styles.input}
          mode="outlined"
          secureTextEntry={true}
        />
        <Button
          title="Valider"
          titleStyle={styles.textbutton}
          type="solid"
          buttonStyle={styles.button}
          onPress={() => {
            handleSubmitNewPassword();
          }}
        />
      </View>
    );
  }

  //Process NewPassword : se déclenche via le bouton valider du nouveau mot de passe
  //modifie le password de la BDD via le Back
  const handleSubmitNewPassword = async () => {
    const data = await fetch(`${urlBack}/new-password`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&newPasswordFromFront=${PasswordChange}`,
    });

    const body = await data.json();

    if (body.result === true) {
      onSubmitUsername(username);
      navigation.navigate("PagesTab");
    } else {
      setListErrorsNewPassword(body.error);
    }
  };

  if (!fontsLoaded) {
    //mécanique pour attendre que les polices soient chargées avant de générer le screen
    return <AppLoading />;
  } else {
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <Header
          barStyle="light-content"
          leftComponent={<Image source={logo} style={styles.logo} />}
          centerComponent={<Text style={styles.title}>InterviewCop</Text>}
          containerStyle={styles.topbar}
        />
        <ScrollView>
          <View style={styles.passwordrecovery}>
            <Text style={styles.title2}>Récupération du mot de passe</Text>

            <TextInput
              placeholder="Username"
              label="Username"
              onChangeText={(username) => setUsername(username)}
              value={username}
              style={styles.input}
              mode="outlined"
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

            <Text style={styles.text}>{listErrorsPasswordRecovery}</Text>

            <Button
              title="Valider"
              titleStyle={styles.textbutton}
              type="solid"
              buttonStyle={styles.button}
              onPress={() => {
                handleSubmitPasswordRecovery();
              }}
            />
          </View>
          {newPasswordView}
          <Text style={styles.text}>{listErrorsNewPassword}</Text>
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
  passwordrecovery: {
    flex: 3,
    alignItems: "center",
  },
  newpassword: {
    flex: 2.3,
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
  title2: {
    color: "#0773A3",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    marginTop: 30,
    marginBottom: 10,
  },
  logo: {
    width: 20,
    height: 35,
    marginLeft: 70,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
    color: "#0773A3",
  },
  button: {
    marginTop: 20,
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

export default connect(null, mapDispatchToProps)(PasswordRecoveryScreen);
