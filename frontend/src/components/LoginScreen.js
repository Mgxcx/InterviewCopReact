import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/loginscreen.css";
import { connect } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import NavBar2 from "./NavBar2";

// styles des inputs
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
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
      padding: "4px !important",
    },
    "& input:valid:focus + fieldset": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
      padding: "4px !important",
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
  },
})(TextField);

function LoginScreen({ onSubmitUsername }) {
  //états liés au Sign-Up
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [listErrorsSignup, setListErrorsSignup] = useState();
  //états liés au Sign-In
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [listErrorsSignin, setListErrorsSignin] = useState();

  const [userExists, setUserExists] = useState(false); //état lié à la vérification de l'existence du user dans la BDD
  const [redirectRecovery, setRedirectRecovery] = useState(false); // état lié à la redirection vers recoverypassword si le mdp est oublié

  //styles des inputs
  const classes = useStyles();

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
    } else {
      setListErrorsSignin(body.error);
    }
  };

  //déclenche la redirection vers HomeScreen si le SignIn ou le SignUp a bien réussi
  if (userExists) {
    return <Redirect to="/home" />;
  }

  // déclenche la redirection vers PasswordRecovery si le user clique sur mot de passe oublié
  const handleClickRecovery = () => {
    setRedirectRecovery(true);
  };
  if (redirectRecovery) {
    return <Redirect to="/passwordrecovery" />;
  }

  // Array des questions secrètes
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
    <div>
      <NavBar2 />
      <div className="container-fluid login">
        <div className="col-md-6">
          <div className="row align-items-center justify-content-center">
            <p className="titlelogin">Déjà un compte ?</p>
          </div>
          <form noValidate autoComplete="off">
            <div className="row align-items-center justify-content-center">
              <ValidationTextField
                className={classes.margin}
                label="Username"
                required
                type="text"
                variant="outlined"
                value={signInUsername}
                onChange={(e) => setSignInUsername(e.target.value)}
              />
            </div>
            <div className="row align-items-center justify-content-center">
              <ValidationTextField
                className={classes.margin}
                label="Mot de passe"
                required
                type="password"
                variant="outlined"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </div>
            <div className="row align-items-center justify-content-center">
              <p
                className="smalltextlogin"
                onClick={() => {
                  handleClickRecovery();
                }}
              >
                Mot de passe oublié ?
              </p>
            </div>
            <div className="row align-items-center justify-content-center">
              <p className="textlogin2">{listErrorsSignin}</p>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className="buttonlogin"
                onClick={() => {
                  handleSubmitSignin();
                }}
                type="button"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <div className="row align-items-center justify-content-center">
            <p className="titlelogin">Pas encore de compte ?</p>
          </div>
          <form noValidate autoComplete="off">
            <div className="row align-items-center justify-content-center">
              <ValidationTextField
                className={classes.margin}
                label="Username"
                required
                type="text"
                variant="outlined"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
              />
            </div>
            <div className="row align-items-center justify-content-center">
              <ValidationTextField
                className={classes.margin}
                label="Mot de passe"
                required
                type="password"
                variant="outlined"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </div>
            <div className="row align-items-center justify-content-center">
              <ValidationTextField
                className={classes.margin}
                label="Choisissez une question secrète"
                variant="outlined"
                select
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
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
                type="text"
                variant="outlined"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className="row align-items-center justify-content-center">
              <p className="textlogin2">{listErrorsSignup}</p>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className="buttonlogin"
                onClick={() => {
                  handleSubmitSignup();
                }}
                type="button"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
