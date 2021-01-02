import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Image, Overlay } from "react-bootstrap";
import "../stylesheets/interviewscreenresult.css";
import { connect } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import { VictoryBar, VictoryChart, VictoryPie } from "victory";

// import { Ionicons } from "@expo/vector-icons";
// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

function InterviewScreenResult({ username, score, detailedscore, job, county }) {
  const [rating, setRating] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisible2, setOverlayVisible2] = useState(false);
  const [listErrorsNewTrophy, setListErrorsNewTrophy] = useState([]);
  const [lastTrophy, setLastTrophy] = useState("");
  const [salary, setSalary] = useState("Aucune donnée disponible");
  const [userPackage, setUserPackage] = useState();
  const [categoriesScores, setCategoriesScores] = useState();
  const [listErrors, setListErrors] = useState();
  const [redirectAdvices, setRedirectAdvices] = useState(false);
  const [redirectInterview, setRedirectInterview] = useState(false);
  const [redirectAccount, setRedirectAccount] = useState(false);

  let trophy;

  useEffect(() => {
    //gestion des résultats par catégorie dans les statistiques détaillées
    var categories = [
      "Parler de soi",
      "Storytelling",
      "Préparatifs de l’entretien",
      "Projection dans l’entreprise",
      "Négociation",
    ];

    var categoriesScores = categories.map((category) => {
      let indices = [];
      var idx = detailedscore.category.indexOf(category);
      while (idx != -1) {
        indices.push(idx);
        idx = detailedscore.category.indexOf(category, idx + 1);
      }

      let scoreCategory;
      if (indices.length > 0) {
        scoreCategory = indices.map((indice) => {
          let indiceScore = detailedscore.score[indice];
          return indiceScore;
        });
      }

      let numberPointsFalse;
      let numberPointsMax;
      let sumScoreCategory;
      if (typeof scoreCategory != "undefined") {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        sumScoreCategory = scoreCategory.reduce(reducer);
        numberPointsMax = indices.length * 10;
        numberPointsFalse = numberPointsMax - sumScoreCategory;
        return {
          category,
          sumScoreCategory,
          numberPointsMax,
          numberPointsFalse,
        };
      }
      return {
        category: " ",
        sumScoreCategory: " ",
        numberPointsMax: " ",
        numberPointsFalse: " ",
      };
    });
    //déclenche le setCategoriesScores au chargement de la page pour récupérer les scores détaillés enregistrés dans Redux
    // pour pouvoir l'afficher dans les statistiques détaillées
    setCategoriesScores(categoriesScores);

    //gestion du score 5 étoiles
    let newScore5Star = score / 10 / 2;
    console.log(newScore5Star);
    //déclenche le setRating au chargement de la page pour récupérer le dernier score enregistré dans Redux
    // pour pouvoir l'afficher ici dans InterviewScreenResult
    setRating(newScore5Star);

    //calcul du salaire d'embauche en récupérant les infos stockées dans redux et en appelant la route du back correspondante
    const calculateSalary = async () => {
      const data = await fetch(`/scrape-salary?job=${job}&county=${county}`);
      const body = await data.json();
      if (body.result === true) {
        setSalary(body.salary);
      }
    };
    calculateSalary();

    //charge le package du user via le Back (via la BDD)
    const fetchData = async () => {
      const data = await fetch(`/shopfind-package?usernameFromFront=${username}`);
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
  }, []);

  //Process NewTrophy : se déclenche via le bouton "suivant" après les conseils suite au dernier entretien
  //récupère le dernier trophée gagné dans la BDD via le Back pour pouvoir le montrer à l'utilisateur
  const handleSubmitNewTrophy = async () => {
    const data = await fetch(`/interviewfind-lasttrophy?usernameFromFront=${username}`);
    const body = await data.json();

    if (body.result === true) {
      setLastTrophy(body.lastTrophyToShow); //on stocke dans un état le trophée récupéré du back
      setListErrorsNewTrophy(body.error);
    }
  };

  // vérification du nombre du trophée stocké précédemment dans l'état pour pouvoir attribuer une image de trophée en fonction
  if (lastTrophy.number) {
    if (lastTrophy.number == 1) {
      trophy = "../images/badgeparfait.png";
    } else if (lastTrophy.number == 2) {
      trophy = "../images/badgepresqueparfait.png";
    } else {
      trophy = "../images/badgeaparfaire.png";
    }
  }

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  const target = useRef(null);

  const toggleOverlay2 = () => {
    setOverlayVisible2(!overlayVisible2);
  };

  const target2 = useRef(null);

  //message en dessous du bouton Statistiques détaillées si le user a un compte "Free" car il ne peut pas y accéder
  const TextNoStats = <p className="textinterviewresult">Upgrade ton compte pour voir les statistiques !</p>;

  // déclenche la redirection vers la page Interview Screen Home si le user clique sur le bouton refaire un entretien
  if (redirectInterview) {
    return <Redirect to="/interviewscreenhome" />;
  }

  // déclenche la redirection vers la page Interview Screen Result si le user clique sur le bouton voir les conseils
  if (redirectAdvices) {
    return <Redirect to="/advices" />;
  }

  // déclenche la redirection vers la page Mon Compte si le user clique sur le bouton Mon Compte dans l'overlay2 du trophée
  if (redirectAccount) {
    return <Redirect to="/account" />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light justify-content-start topbarinterviewresult">
        <Image src="../images/MikeChickenRight.png" className="logointerviewresult" />
        <p className="titleinterviewresult">InterviewCop</p>
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
      <div className="container-fluid interviewresult">
        <div className="col">
          <div className="row align-items-center justify-content-center">
            <p className="titleinterviewresult2">Mon score</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating name="half-rating-read" size="large" value={rating} precision={0.1} readOnly />
            </Box>
          </div>
          {userPackage ? (
            <>
              <div className="row align-items-center justify-content-center">
                <button
                  className="buttoninterviewresult2"
                  ref={target}
                  onClick={() => {
                    (userPackage.name == "+" || userPackage.name == "Pro") && toggleOverlay();
                  }}
                  type="button"
                >
                  Statistiques détaillées
                </button>
              </div>
              {userPackage.name == "Free" && TextNoStats}
            </>
          ) : (
            <>
              <div className="row align-items-center justify-content-center">
                <p className="textinterviewresult">{listErrors}</p>
              </div>
            </>
          )}
          <div className="row align-items-center justify-content-center">
            <p className="textinterviewresult">Votre salaire d'embauche : {salary} bruts annuel</p>
          </div>
          <div className="row align-items-center justify-content-center mb-4">
            <p className="texticopresult">Bravo {username} ! C'était un entretien rondement mené !</p>
            <Image src="../images/MikeChickenLeft.png" className="imageinterviewresult" />
          </div>
          <div className="row align-items-center justify-content-center">
            <p className="texticopresult">Vous devriez vous perfectionner sur :</p>
          </div>
          {categoriesScores && (
            <>
              {categoriesScores.map(
                (categoriescore) =>
                  categoriescore.numberPointsFalse >= 6 && (
                    <div className="row align-items-center justify-content-center">
                      <p className="textcategoryresult">{categoriescore.category}</p>
                    </div>
                  )
              )}
            </>
          )}
          <div className="row align-items-center justify-content-center">
            <button
              className="buttoninterviewresult2"
              onClick={() => {
                setRedirectAdvices(true);
              }}
              type="button"
            >
              Voir les conseils
            </button>
            <button
              className="buttoninterviewresult2"
              onClick={() => {
                setRedirectInterview(true);
              }}
              type="button"
            >
              Refaire un entretien !
            </button>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="buttoninterviewresult"
              ref={target2}
              onClick={() => {
                toggleOverlay2();
                handleSubmitNewTrophy();
              }}
              type="button"
            >
              >
            </button>
          </div>
        </div>
        <Overlay target={target.current} show={overlayVisible}>
          {({ arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                display: "flex",
                position: "absolute",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#4fa2c7",
                backgroundColor: "#4fa2c7",
                padding: 200,
                marginTop: 170,
                marginLeft: 170,
                width: "60%",
                height: "80%",
                color: "#fffefa",
                borderRadius: 20,
                opacity: 0.97,
                ...props.style,
              }}
            >
              <div className="col">
                <div className="row align-items-center justify-content-center">
                  <p className="titleinterviewresult">Résultats par question</p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <VictoryChart
                    padding={{ top: 5, bottom: 40, left: 50, right: 50 }}
                    domainPadding={20}
                    height={130}
                    width={340}
                  >
                    <VictoryBar
                      style={{
                        data: { fill: "#E8C518", stroke: "#0773A3", strokeWidth: 1 },
                      }}
                      data={[
                        { x: "q1", y: detailedscore.score[0] },
                        { x: "q2", y: detailedscore.score[1] },
                        { x: "q3", y: detailedscore.score[2] },
                        { x: "q4", y: detailedscore.score[3] },
                        { x: "q5", y: detailedscore.score[4] },
                        { x: "q6", y: detailedscore.score[5] },
                        { x: "q7", y: detailedscore.score[6] },
                        { x: "q8", y: detailedscore.score[7] },
                        { x: "q9", y: detailedscore.score[8] },
                        { x: "q10", y: detailedscore.score[9] },
                      ]}
                      cornerRadius={5}
                    />
                  </VictoryChart>
                </div>
                <div className="row align-items-center justify-content-center">
                  <p className="titleinterviewresult">Résultats par catégorie</p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <VictoryPie
                    data={[
                      {
                        x: `Parler de soi \n ${categoriesScores[0].sumScoreCategory}/${categoriesScores[0].numberPointsMax}`,
                        y: categoriesScores[0].sumScoreCategory,
                      },
                      {
                        x: " ",
                        y: categoriesScores[0].numberPointsFalse,
                      },
                      {
                        x: `Storytelling \n ${categoriesScores[1].sumScoreCategory}/${categoriesScores[1].numberPointsMax}`,
                        y: categoriesScores[1].sumScoreCategory,
                      },
                      {
                        x: " ",
                        y: categoriesScores[1].numberPointsFalse,
                      },
                      {
                        x: `Préparatifs \n ${categoriesScores[2].sumScoreCategory}/${categoriesScores[2].numberPointsMax}`,
                        y: categoriesScores[2].sumScoreCategory,
                      },
                      {
                        x: " ",
                        y: categoriesScores[2].numberPointsFalse,
                      },
                      {
                        x: `Projection \n ${categoriesScores[3].sumScoreCategory}/${categoriesScores[3].numberPointsMax}`,
                        y: categoriesScores[3].sumScoreCategory,
                      },
                      {
                        x: " ",
                        y: categoriesScores[3].numberPointsFalse,
                      },
                      {
                        x: `Négociation \n ${categoriesScores[4].sumScoreCategory}/${categoriesScores[4].numberPointsMax}`,
                        y: categoriesScores[4].sumScoreCategory,
                      },
                      {
                        x: " ",
                        y: categoriesScores[4].numberPointsFalse,
                      },
                    ]}
                    height={190}
                    padding={{ top: 50, bottom: 50, left: 40, right: 40 }}
                    colorScale={[
                      "#ED1C24",
                      "#ED1C24B3",
                      "#E8C518",
                      "#E8C518B3",
                      "#208C58",
                      "#208C58B3",
                      "#0773A3",
                      "#0773A3B3",
                      "#333333",
                      "#333333B3",
                    ]}
                    cornerRadius={0}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttoninterviewresult5"
                    ref={target}
                    onClick={() => {
                      toggleOverlay();
                    }}
                    type="button"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          )}
        </Overlay>
        <Overlay target={target2.current} show={overlayVisible2}>
          {({ arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                display: "flex",
                position: "absolute",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#4fa2c7",
                backgroundColor: "#4fa2c7",
                padding: 200,
                marginTop: 170,
                marginLeft: 170,
                width: "60%",
                height: "80%",
                color: "#fffefa",
                borderRadius: 20,
                opacity: 0.97,
                ...props.style,
              }}
            >
              <div className="col">
                <div className="row align-items-center justify-content-center">
                  <p className="titleresult">
                    Vous avez gagné le trophée {"\n"} {lastTrophy.name}
                  </p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <Image src={trophy} className="trophyresult" />
                </div>
                <div className="row align-items-center justify-content-center">
                  <p className="textresult">{listErrorsNewTrophy}</p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttoninterviewresult4"
                    ref={target2}
                    onClick={() => {
                      toggleOverlay2();
                      setRedirectAccount(true);
                    }}
                    type="button"
                  >
                    Mon Compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </Overlay>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    username: state.username,
    score: state.score,
    detailedscore: state.detailedscore,
    job: state.job,
    county: state.county,
  };
}

export default connect(mapStateToProps, null)(InterviewScreenResult);
