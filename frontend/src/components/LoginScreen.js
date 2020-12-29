import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/loginscreen.css";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

// import { StyleSheet, Text, View, ScrollView, Image, KeyboardAvoidingView } from "react-native";
// import { Button, Header } from "react-native-elements";
// import { TextInput } from "react-native-paper";
// import AppLoading from "expo-app-loading";
// import DropDownPicker from "react-native-dropdown-picker";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

// styles des inputs
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& .MuiValidationTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

// styles des inputs
const ValidationTextField = withStyles({
  root: {
    "& input:valid + fieldset": {
      color: "#4FA2C7",
      borderColor: "#4FA2C7",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      color: "#4FA2C7",
      borderColor: "#4FA2C7",
      borderWidth: 2,
    },
    "& input:invalid:hover + fieldset": {
      color: "#4FA2C7",
      borderColor: "#4FA2C7",
      borderWidth: 2,
    },
    "& input:valid:hover + fieldset": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
      padding: "4px !important", // override inline-style
    },
    "& input:valid:focus + fieldset": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
      padding: "4px !important", // override inline-style
    },
    "& label.Mui-focused": {
      color: "#0773a3",
    },
    "& label": {
      color: "#4FA2C7",
    },
    "& input": {
      color: "#0773a3",
      width: "300px",
    },
    "& .MuiOutlinedInput-root": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
      width: "280px",
    },
    "& .MuiSelect-outlined": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
    },
    "& .MuiInputBase-input": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
    },
    "& .MuiInputBase-root": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
    },
    "& .MuiOutlinedInput-input": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
    },
  },
})(TextField);

function LoginScreen({ onSubmitUsername }) {
  //états liés au Sign-Up
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [listErrorsSignup, setListErrorsSignup] = useState([]); //les messages d'erreur sont transmis par le Back
  //états liés au Sign-In
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [listErrorsSignin, setListErrorsSignin] = useState(); //les messages d'erreur sont transmis par le Back
  const [userExists, setUserExists] = useState(false); //état lié à la vérification de l'existence du user dans la BDD
  const [redirectRecovery, setRedirectRecovery] = useState(false); // état lié à la redirection vers recoverypassword si le mdp est oublié
  //   //pour gérer les polices expo-google-fonts
  //   let [fontsLoaded] = useFonts({
  //     Montserrat_500Medium,
  //     Montserrat_400Regular,
  //     Montserrat_400Regular_Italic,
  //     Montserrat_700Bold,
  //   });
  //Process SignUp : se déclenche via le bouton connecter du "pas encore de compte?"
  //interroge la BDD via le Back, le Back vérifie que le user est bien créé dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignup = async () => {
    const data = await fetch("/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signUpUsername}&passwordFromFront=${signUpPassword}&secret_question=${secretQuestion}&secret_question_answer=${answer}`,
    });
    const body = await data.json();
    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signUpUsername);
      <Redirect to="/home" />;
    } else {
      setListErrorsSignup(body.error);
    }
  };
  //Process SignIn : se déclenche via le bouton connecter du "déjà un compte?"
  //interroge la BDD via le Back, le Back vérifie que le user existe dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignin = async () => {
    const data = await fetch("/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signInUsername}&passwordFromFront=${signInPassword}`,
    });
    const body = await data.json();
    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signInUsername);
      <Redirect to="/home" />;
    } else {
      setListErrorsSignin(body.error);
    }
  };

  //déclenche la redirection vers HomeScreen si le SignIn ou le SignUp a bien réussi
  useEffect(() => {
    if (userExists) {
      return <Redirect to="/home" />;
    }
  }, [userExists]);

  //styles des inputs
  const classes = useStyles();

  // déclenche la redirection vers PasswordRecovery si le user clique sur mot de passe oublié
  const handleClickRecovery = () => {
    setRedirectRecovery(true);
  };
  if (redirectRecovery) {
    return <Redirect to="/passwordrecovery" />;
  }

  const handleChangeSecretQuestion = (event) => {
    setSecretQuestion(event.target.value);
  };

  const secretQuestions = [
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
  ];

  return (
    <div className="container-fluid login">
      {/* <div className="row align-items-center justify-content-center">
        <Image src="../images/MikeChickenLeft.png" className="logo" />
      </div> */}
      <div className="col">
        <div className="row align-items-center justify-content-center">
          <p className="title">Déjà un compte ?</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Username"
            required
            variant="outlined"
            id="validation-outlined-input"
            onChange={(username) => setSignInUsername(username)}
            value={signInUsername}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Mot de passe"
            required
            type="password"
            variant="outlined"
            id="validation-outlined-input"
            onChange={(password) => setSignInPassword(password)}
            value={signInPassword}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <p
            className="smalltext"
            onClick={() => {
              handleClickRecovery();
            }}
          >
            Mot de passe oublié ?
          </p>
        </div>
        <div className="row align-items-center justify-content-center">
          <p className="text2">{listErrorsSignin}</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <button
            className="button"
            onClick={() => {
              handleSubmitSignin();
            }}
            type="button"
          >
            Se connecter
          </button>
        </div>
      </div>
      <div className="col">
        <div className="row align-items-center justify-content-center">
          <p className="title">Pas encore de compte ?</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Username"
            required
            variant="outlined"
            id="validation-outlined-input"
            onChange={(username) => setSignUpUsername(username)}
            value={signUpUsername}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Mot de passe"
            required
            type="password"
            variant="outlined"
            id="validation-outlined-input"
            onChange={(password) => setSignUpPassword(password)}
            value={signUpPassword}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Choisissez une question secrète"
            variant="outlined"
            select
            id="validation-outlined-input"
            onChange={handleChangeSecretQuestion}
            value={secretQuestion}
          >
            {secretQuestions.map((option) => (
              <MenuItem key={option.value} value={option.value} className={classes.margin}>
                {option.label}
              </MenuItem>
            ))}
          </ValidationTextField>
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Réponse"
            required
            variant="outlined"
            id="validation-outlined-input"
            onChange={(answer) => setAnswer(answer)}
            value={answer}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <p className="text2">{listErrorsSignup}</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <button
            className="button"
            onClick={() => {
              handleSubmitSignup();
            }}
            type="button"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
    //       <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
    //         <Header
    //           barStyle="light-content"
    //           leftComponent={<Image source={logo} style={styles.logo} />}
    //           centerComponent={<Text style={styles.title}>InterviewCop</Text>}
    //           containerStyle={styles.topbar}
    //         />
    //         <ScrollView>
    //           <View style={styles.signin}>
    //             <Text style={styles.text}>Déjà un compte ?</Text>
    //             <TextInput
    //               placeholder="Username"
    //               label="Username"
    //               onChangeText={(username) => setSignInUsername(username)}
    //               value={signInUsername}
    //               style={styles.input}
    //               mode="outlined"
    //             />
    //             <TextInput
    //               placeholder="Mot de passe"
    //               label="Mot de passe"
    //               value={signInPassword}
    //               onChangeText={(password) => setSignInPassword(password)}
    //               style={styles.input}
    //               mode="outlined"
    //               secureTextEntry={true}
    //             />
    //             <Text
    //               style={styles.smalltext}
    //               onPress={() => {
    //                 navigation.navigate("PasswordRecovery");
    //               }}
    //             >
    //               Mot de passe oublié ?
    //             </Text>
    //             <Text style={styles.text2}>{listErrorsSignin}</Text>
    //             <Button
    //               title="Se connecter"
    //               titleStyle={styles.textbutton}
    //               type="solid"
    //               buttonStyle={styles.button}
    //               onPress={() => {
    //                 handleSubmitSignin();
    //               }}
    //             />
    //           </View>
    //           <View style={styles.signup}>
    //             <Text style={styles.text}>Pas encore de compte ?</Text>
    //             <TextInput
    //               placeholder="Username"
    //               label="Username"
    //               onChangeText={(username) => setSignUpUsername(username)}
    //               value={signUpUsername}
    //               style={styles.input}
    //               mode="outlined"
    //             />
    //             <TextInput
    //               placeholder="Mot de passe"
    //               label="Mot de passe"
    //               onChangeText={(password) => setSignUpPassword(password)}
    //               value={signUpPassword}
    //               style={styles.input}
    //               mode="outlined"
    //               secureTextEntry={true}
    //             />
    //             <DropDownPicker
    //               items={[
    //                 {
    //                   label: "Quel est le nom de votre premier animal de compagnie?",
    //                   value: "Quel est le nom de votre premier animal de compagnie?",
    //                 },
    //                 {
    //                   label: "Quelle est la date de naissance de votre mère?",
    //                   value: "Quelle est la date de naissance de votre mère?",
    //                 },
    //                 {
    //                   label: "Quel est votre plat favori?",
    //                   value: "Quel est votre plat favori?",
    //                 },
    //               ]}
    //               defaultIndex={0}
    //               placeholder="Choisissez une question secrète"
    //               style={styles.colordropdown}
    //               dropDownStyle={styles.colordropdown}
    //               containerStyle={styles.containerdropdown}
    //               labelStyle={styles.labeldropdown}
    //               onChangeItem={(item) => setSecretQuestion(item.value)}
    //               value={secretQuestion}
    //             />
    //             <TextInput
    //               placeholder="Réponse"
    //               label="Réponse"
    //               onChangeText={(answer) => setAnswer(answer)}
    //               value={answer}
    //               style={styles.input}
    //               mode="outlined"
    //             />
    //             <Text style={styles.text2}>{listErrorsSignup}</Text>
    //             <Button
    //               title="Se connecter"
    //               titleStyle={styles.textbutton}
    //               type="solid"
    //               buttonStyle={styles.button}
    //               onPress={() => {
    //                 handleSubmitSignup();
    //               }}
    //             />
    //           </View>
    //         </ScrollView>
    //       </KeyboardAvoidingView>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitUsername: function (username) {
      dispatch({ type: "saveUsername", username });
    },
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);
