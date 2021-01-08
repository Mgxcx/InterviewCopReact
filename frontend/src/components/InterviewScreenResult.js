import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Image, Modal } from "react-bootstrap";
import "../stylesheets/interviewscreenresult.css";
import { connect } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import { VictoryBar, VictoryChart, VictoryPie } from "victory";
import NavBar from "./NavBar";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

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
      while (idx !== -1) {
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

  //message en dessous du bouton Statistiques détaillées si le user a un compte "Free" car il ne peut pas y accéder
  const TextNoStats = <p className="textinterviewresult2">Upgrade ton compte pour voir les statistiques !</p>;

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
      <NavBar />
      <div className="container-fluid interviewresult">
        <div className="col-12">
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
              {userPackage.name == "Free" && TextNoStats}
              <div className="row align-items-center justify-content-center">
                <button
                  className="buttoninterviewresult2"
                  onClick={() => {
                    (userPackage.name == "+" || userPackage.name == "Pro") && setOverlayVisible(true);
                  }}
                  type="button"
                >
                  Statistiques détaillées
                </button>
              </div>
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
                (categoriescore, i) =>
                  categoriescore.numberPointsFalse >= 6 && (
                    <div key={i} className="row align-items-center justify-content-center">
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
              onClick={() => {
                setOverlayVisible2(true);
                handleSubmitNewTrophy();
              }}
              type="button"
            >
              <ArrowForwardIcon style={{ color: "#fffefa" }} />
            </button>
          </div>
        </div>
        <Modal
          show={overlayVisible}
          dialogClassName="overlaydialoginterviewresult"
          contentClassName="overlaycontentinterviewresult"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          size="lg"
        >
          <Modal.Body>
            {categoriesScores && (
              <>
                <div className="col">
                  <div className="row align-items-center justify-content-center">
                    <p className="titleinterviewresult">Résultats par question</p>
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <VictoryChart
                      padding={{ top: 5, bottom: 40, left: 50, right: 50 }}
                      domainPadding={20}
                      height={220}
                      width={430}
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
                  <div className="row align-items-center justify-content-center mt-5">
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
                      height={280}
                      padding={{ top: 50, bottom: 50, left: 20, right: 20 }}
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
                      onClick={() => {
                        setOverlayVisible(false);
                      }}
                      type="button"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={overlayVisible2}
          dialogClassName="overlaydialoginterviewresult"
          contentClassName="overlaycontentinterviewresult"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          size="lg"
        >
          <Modal.Body>
            <div className="col">
              <div className="row align-items-center justify-content-center">
                <p className="titleinterviewresult">
                  Vous avez gagné le trophée {"\n"} {lastTrophy.name}
                </p>
              </div>
              <div className="row align-items-center justify-content-center">
                <Image src={trophy} className="trophyresult" />
              </div>
              <div className="row align-items-center justify-content-center">
                <p className="textinterviewresult">{listErrorsNewTrophy}</p>
              </div>
              <div className="row align-items-center justify-content-center">
                <button
                  className="buttoninterviewresult4"
                  onClick={() => {
                    setOverlayVisible2(false);
                    setRedirectAccount(true);
                  }}
                  type="button"
                >
                  Mon Compte
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
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
