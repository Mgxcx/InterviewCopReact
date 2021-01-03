import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/accountscreen.css";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
//   Montserrat_100Thin,

function AccountScreen({ username }) {
  const [userScores, setUserScores] = useState();
  const [userTrophies, setUserTrophies] = useState();
  const [userIcops, setUserIcops] = useState();
  const [userPackage, setUserPackage] = useState();
  const [listErrors, setListErrors] = useState();
  const [listErrorsScores, setListErrorsScores] = useState();
  const [listErrorsTrophies, setListErrorsTrophies] = useState();
  const [listErrorsPackage, setListErrorsPackage] = useState();
  const [listErrorsIcops, setListErrorsIcops] = useState();

  const [redirectShop, setRedirectShop] = useState(false);
  const [redirectChat, setRedirectChat] = useState(false);

  //charge les scores, trophées, icops et package du user via le Back (via la BDD)
  useEffect(() => {
    const fetchData = async () => {
      console.log(username);
      const data = await fetch(`/accountfind-informationdatabase?usernameFromFront=${username}`);
      const body = await data.json();
      console.log(body);
      if (body.result === true) {
        setUserScores(body.scoresDataBase);
        setUserTrophies(body.trophiesDataBase);
        setUserIcops(body.icopsDataBase);
        setUserPackage(body.packageDataBase);
        setListErrorsScores(body.errorscores);
        setListErrorsTrophies(body.errortrophies);
        setListErrorsPackage(body.errorpackage);
        setListErrorsIcops(body.erroricops);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
  }, []);

  // déclenche la redirection vers la page Shop si le user clique sur le bouton Upgrade en dessous de sa formule (uniquement s'il n'a pas la formule Pro)
  if (redirectShop) {
    return <Redirect to="/shop" />;
  }

  // déclenche la redirection vers la page Chat si le user clique sur le bouton Chat en bas de la page (uniquement s'il a la formule Pro)
  if (redirectShop) {
    return <Redirect to="/chat" />;
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
            <p className="titleaccount2">Mes scores aux derniers entretiens</p>
          </div>
          {userScores && (
            <>
              {userScores.length > 0 ? (
                <div className="row align-items-center justify-content-center mt-4">
                  <p className="textaccount">{userScores[userScores.length - 3]} / 100</p>
                  <p className="textaccount">{userScores[userScores.length - 2]} / 100</p>
                  <p className="textaccount">{userScores[userScores.length - 1]} / 100</p>
                </div>
              ) : (
                <div className="row align-items-center justify-content-center mt-4">
                  <p className="textaccount">{listErrorsScores}</p>
                </div>
              )}
            </>
          )}
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titleaccount2">Mes trophées</p>
          </div>
          {userTrophies && (
            <>
              <div className="row align-items-center justify-content-center mt-4">
                {userTrophies.length > 0 ? (
                  userTrophies.map((trophies, i) => {
                    // vérification des nombres des trophées stockés précédemment dans l'état userTrophies pour pouvoir attribuer une image de trophée en fonction
                    let path;
                    if (trophies.number == 1) {
                      path = "../images/badgeparfait.png";
                    } else if (trophies.number == 2) {
                      path = "../images/badgepresqueparfait.png";
                    } else if (trophies.number == 3) {
                      path = "../images/badgeaparfaire.png";
                    }
                    return <Image key={i} src={path} className="trophyaccount" />;
                  })
                ) : (
                  <p className="textaccount">{listErrorsTrophies}</p>
                )}
              </div>
            </>
          )}
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titleaccount2">Ma formule</p>
          </div>

          {userPackage ? (
            <>
              <div className="row align-items-center justify-content-center mt-4">
                <p className="textaccount">
                  Ma formule {userPackage.name} {"\n"} à {userPackage.price} €
                </p>
              </div>

              {(userPackage.name == "Free" || userPackage.name == "+") && (
                <div className="row align-items-center justify-content-center mt-4">
                  <button
                    className="buttonaccount"
                    onClick={() => {
                      setRedirectShop(true);
                    }}
                    type="button"
                  >
                    Upgrade!
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="row align-items-center justify-content-center mt-4">
              <p className="textaccount">{listErrorsPackage}</p>
            </div>
          )}
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titleaccount2">Mes iCops</p>
          </div>
          {userIcops ? (
            <>
              <div className="row align-items-center justify-content-center mt-4">
                {userIcops.map((icops, i) => {
                  let icopimage;
                  if (icops.number == 1) {
                    icopimage = "../images/MikeChickenSmall.png";
                  } else if (icops.number == 2) {
                    icopimage = "../images/AgentToufSmall.png";
                  }
                  return <Image key={i} src={icopimage} className="icopaccount" />;
                })}
              </div>
            </>
          ) : (
            <div className="row align-items-center justify-content-center mt-4">
              <p className="textaccount">{listErrorsIcops}</p>
            </div>
          )}
          {userPackage && (
            <div className="row align-items-center justify-content-center mt-4">
              {userPackage.name == "Pro" && (
                <button
                  className="buttonaccount"
                  onClick={() => {
                    setRedirectChat(true);
                  }}
                  type="button"
                >
                  Chat
                </button>
              )}
            </div>
          )}
          <div className="row align-items-center justify-content-center mt-4">
            <p className="textaccount">{listErrors}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username, score: state.score };
}

export default connect(mapStateToProps, null)(AccountScreen);
