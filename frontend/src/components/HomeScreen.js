import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/homescreen.css";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_400Regular_Italic,
//   Montserrat_500Medium,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

function HomeScreen({ username }) {
  //   const logo = require("../assets/MikeChickenRight.png");
  //   const image = require("../assets/MikeChickenLeft.png");
  //   let [fontsLoaded] = useFonts({
  //     Montserrat_500Medium,
  //     Montserrat_400Regular,
  //     Montserrat_400Regular_Italic,
  //     Montserrat_700Bold,
  //   });

  const [redirectGo, setRedirectGo] = useState(false);
  const [redirectAdvices, setRedirectAdvices] = useState(false);

  // déclenche la redirection vers la page Interview Screen Home si le user clique sur Go!
  const handleClickGo = () => {
    setRedirectGo(true);
  };
  if (redirectGo) {
    return <Redirect to="/interviewscreenhome" />;
  }

  // déclenche la redirection vers la page Conseils si le user clique sur Des conseils!
  const handleClickAdvices = () => {
    setRedirectAdvices(true);
  };
  if (redirectAdvices) {
    return <Redirect to="/advices" />;
  }

  return (
    <div>
      <nav class="navbar sticky-top navbar-light justify-content-center topbar">
        <Image src="../images/MikeChickenRight.png" className="logo" />
        <p className="title">InterviewCop</p>
      </nav>
      <div className="container-fluid home">
        <div className="col">
          <div className="row align-items-center justify-content-center mt-4">
            <p className="title2">Bienvenue {username} !</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <Image src="../images/MikeChickenLeft.png" className="image" />
          </div>
          <div className="row align-items-center justify-content-center">
            <p className="text">InterviewCop vous entraîne à passer des entretiens d'embauche</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="button"
              onClick={() => {
                handleClickGo();
              }}
              type="button"
            >
              Go !
            </button>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="button"
              onClick={() => {
                handleClickAdvices();
              }}
              type="button"
            >
              Des conseils !
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

export default connect(mapStateToProps, null)(HomeScreen);
