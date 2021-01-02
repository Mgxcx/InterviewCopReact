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
      <nav className="navbar navbar-expand-lg navbar-light justify-content-start topbarinterviewscreen">
        <Image src="../images/MikeChickenRight.png" className="logointerviewscreen" />
        <p className="titleinterviewscreen">InterviewCop</p>
        <button
          class="navbar-toggler ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon togglerstyle"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link linkstyle" href="/home">
                Accueil
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link linkstyle" href="/account">
                Mon Compte
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link linkstyle" href="/interviewscreenhome">
                Entretien
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link linkstyle" href="/advices">
                Conseils
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link linkstyle" href="/shop">
                Shop
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid home">
        <div className="col">
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titlehome2">Bienvenue {username} !</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <Image src="../images/MikeChickenLeft.png" className="imagehome" />
          </div>
          <div className="row align-items-center justify-content-center">
            <p className="texthome">InterviewCop vous entraîne à passer des entretiens d'embauche</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="buttonhome"
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
              className="buttonhome"
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
