import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/welcomescreen.css";
import { Image } from "react-bootstrap";
import NavBar2 from "./NavBar2";

function WelcomeScreen() {
  const [redirectLogin, setRedirectLogin] = useState(false);

  const handleClick = () => {
    setRedirectLogin(true);
  };

  if (redirectLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <NavBar2 />
      <div className="container-fluid welcome">
        <div className="col-12">
          <div className="row align-items-center justify-content-center">
            <Image src="../images/AgentToufSmall.png" className="logowelcome" />
            <Image src="../images/MikeChickenSmall.png" className="logowelcome" />
          </div>
          <div className="row align-items-center justify-content-center">
            <p className="titlewelcome">
              Bienvenue sur InterviewCop ! <br />
              L'application qui vous entraîne aux entretiens d'embauche :)
            </p>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="buttonwelcome"
              onClick={() => {
                handleClick();
              }}
              type="button"
            >
              C'est parti !
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
