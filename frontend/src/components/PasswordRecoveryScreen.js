import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/passwordrecoveryscreen.css";
import { connect } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
    "& .Mui-selected": {
      color: "#0773a3",
      borderColor: "#0773a3",
      borderWidth: 2,
    },
  },
})(TextField);

function PasswordRecoveryScreen({ onSubmitUsername }) {
  const [username, setUsername] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [listErrorsPasswordRecovery, setListErrorsPasswordRecovery] = useState([]); //les messages d'erreur sont transmis par le Back
  const [listErrorsNewPassword, setListErrorsNewPassword] = useState([]); //les messages d'erreur sont transmis par le Back

  const [userQuestionAndAnswer, setUserQuestionAndAnswer] = useState(false); //état lié à la vérification de la question secrète choisie et la réponse du user dans la BDD
  const [PasswordChange, setPasswordChange] = useState("");
  const [newPassword, setNewPassword] = useState(false);

  //styles des inputs
  const classes = useStyles();

  //Process PasswordRecovery : se déclenche via le bouton valider de la récupération de mot de passe
  //interroge la BDD via le Back, le Back vérifie que la question secrète choisie et la réponse correspondent au User et renvoie un message d'erreur le cas échéant
  const handleSubmitPasswordRecovery = async () => {
    const data = await fetch("/password-recovery", {
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

  let newPasswordDiv;
  if (userQuestionAndAnswer) {
    newPasswordDiv = (
      <div>
        <div className="row align-items-center justify-content-center mt-5">
          <ValidationTextField
            className={classes.margin}
            label="Nouveau mot de passe"
            required
            type="password"
            variant="outlined"
            value={PasswordChange}
            onChange={(e) => setPasswordChange(e.target.value)}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <p className="textrecovery">{listErrorsNewPassword}</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <button
            className="buttonrecovery"
            onClick={() => {
              handleSubmitNewPassword();
            }}
            type="button"
          >
            Valider
          </button>
        </div>
      </div>
    );
  }

  //Process NewPassword : se déclenche via le bouton valider du nouveau mot de passe
  //modifie le password de la BDD via le Back
  const handleSubmitNewPassword = async () => {
    const data = await fetch("/new-password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&newPasswordFromFront=${PasswordChange}`,
    });

    const body = await data.json();

    if (body.result === true) {
      onSubmitUsername(username);
      setNewPassword(true);
    } else {
      setListErrorsNewPassword(body.error);
    }
  };

  //si tout s'est bien passé, redirection vers la home !
  if (newPassword) {
    return <Redirect to="/home" />;
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
    <div className="container-fluid passwordrecovery">
      <div className="col">
        <div className="row align-items-center justify-content-center">
          <p className="titlerecovery">Récupération du mot de passe</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <ValidationTextField
            className={classes.margin}
            label="Username"
            required
            type="text"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <p className="textrecovery">{listErrorsPasswordRecovery}</p>
        </div>
        <div className="row align-items-center justify-content-center">
          <button
            className="buttonrecovery"
            onClick={() => {
              handleSubmitPasswordRecovery();
            }}
            type="button"
          >
            Valider
          </button>
        </div>
        {newPasswordDiv}
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

export default connect(null, mapDispatchToProps)(PasswordRecoveryScreen);
