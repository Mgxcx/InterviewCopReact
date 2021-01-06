import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/homescreen.css";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";
import NavBar from "./NavBar";

function HomeScreen({ username }) {
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
      <NavBar />
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
