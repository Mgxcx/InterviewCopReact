import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Image, Overlay } from "react-bootstrap";
import "../stylesheets/interviewscreen.css";
import { connect } from "react-redux";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

function InterviewScreen({ username, onSubmitLastScore, onSubmitDetailedScore, icop }) {
  const [questionNumber, setQuestionNumber] = useState(1); //compteur des questions affiché sur la top bar entretien
  const [questionList, setQuestionList] = useState(); //stocke les données des questions envoyées par le back (questions,réponses,conseils etc)
  const [lastQuestion, setLastQuestion] = useState(false); // état pour pouvoir gérer la redirection au résultat après la question 10

  const [tempScore, setTempScore] = useState(0); //score temporaire associé à la réponse actuellement sélectionnée (pas encore confirmée par le user)

  const [score, setScore] = useState([]); //lorsque la réponse est confirmée par le user, le score final est incrémenté
  const [category, setCategory] = useState([]); //lorsque la réponse est confirmée par le user, la liste des categories de questions est enregistrée (pour envoi dans redux à la fin)

  //états liés aux réponses, un état passe à true si la réponse associée est sélectionnée par le user
  const [answerA, setAnswerA] = useState(false);
  const [answerB, setAnswerB] = useState(false);
  const [answerC, setAnswerC] = useState(false);
  const [answerD, setAnswerD] = useState(false);

  //état gérant l'overlay du conseil
  const [overlayVisible, setOverlayVisible] = useState(false);
  const target = useRef(null);

  //charge les questions (générées aléatoirement par le backend)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/generate-questions?icop=${icop}`);
      const body = await data.json();
      if (body.result === true) {
        setQuestionList(body.questionsArray);
      }
    };
    fetchData();
  }, []);

  //mécanique lorsque le user choisit une réponse
  const handleSelectedAnswer = (order, points) => {
    if (order === "A") {
      setAnswerA(true);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(false);
    } else if (order === "B") {
      setAnswerA(false);
      setAnswerB(true);
      setAnswerC(false);
      setAnswerD(false);
    } else if (order === "C") {
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(true);
      setAnswerD(false);
    } else {
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(true);
    }

    setTempScore(points);
  };

  //mécanique qui incrémente le score et charge la question suivante
  const handleNextQuestion = (newCategory) => {
    if (answerA || answerB || answerC || answerD) {
      //vérification qu'une réponse a bien été sélectionnée par l'utilisateur
      setScore([...score, tempScore]); //enregistrement du score
      setCategory([...category, newCategory]);
      questionNumber < 10 && setQuestionNumber((prev) => prev + 1); //incrémente le compteur des questions
      //réinitialisation des états liés aux réponses
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(false);
    }
  };

  // //envoi du score et du username au back à la fin de l'entretien (une fois la question 10 validée)
  const handleSubmitLastQuestion = async () => {
    const finalScore = score.reduce((a, b) => a + b, 0);

    const data = await fetch("/interviewsave-scoreandtrophy", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&scoreFromFront=${finalScore}`,
    });
    const body = await data.json();
    if (body.result === true) {
      console.log("je suis dans le true");
      onSubmitLastScore(finalScore); //envoie le score total dans redux
      onSubmitDetailedScore({ score, category }); //envoie le resultat de chaque question dans redux
      setLastQuestion(true);
    }
  };

  //déclenche handleSubmitLastQuestion après la dernière question

  if (score.length === 10) {
    handleSubmitLastQuestion();
  }

  // déclenche la redirection vers la page Interview Screen Result si le user est arrivé à la question 10 et appuie sur OK du dernier conseil
  if (lastQuestion) {
    return <Redirect to="/interviewscreenresult" />;
  }

  // Remplit la variable questiondisplay si l'on a bien récupéré la liste de questions/réponses du backend
  let questionDisplay;
  if (questionList) {
    questionDisplay = questionList[questionNumber - 1]; //lorsque le compteur des questions s'actualise, la question suivante est chargée
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light justify-content-start topbar">
        <Image src="../images/MikeChickenRight.png" className="logo" />
        <p className="title">InterviewCop</p>
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
      <div className="container-fluid interview">
        {questionDisplay && (
          <div className="col">
            <div className="row align-items-center justify-content-center">
              <p className="title2">Question {questionNumber}/10</p>
            </div>
            <div className="row align-items-center justify-content-center">
              <p className="title2">{questionDisplay.question}</p>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className={answerA ? "buttonanswerselected" : "buttonanswer"}
                onClick={() => {
                  handleSelectedAnswer("A", questionDisplay.answers[0].points);
                }}
                type="button"
              >
                {questionDisplay.answers[0].text}
              </button>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className={answerB ? "buttonanswerselected" : "buttonanswer"}
                onClick={() => {
                  handleSelectedAnswer("B", questionDisplay.answers[1].points);
                }}
                type="button"
              >
                {questionDisplay.answers[1].text}
              </button>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className={answerC ? "buttonanswerselected" : "buttonanswer"}
                onClick={() => {
                  handleSelectedAnswer("C", questionDisplay.answers[2].points);
                }}
                type="button"
              >
                {questionDisplay.answers[2].text}
              </button>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className={answerD ? "buttonanswerselected" : "buttonanswer"}
                onClick={() => {
                  handleSelectedAnswer("D", questionDisplay.answers[3].points);
                }}
                type="button"
              >
                {questionDisplay.answers[3].text}
              </button>
            </div>
            <div className="row align-items-center justify-content-center">
              <button
                className="button"
                ref={target}
                onClick={() => {
                  setOverlayVisible(true);
                }}
                type="button"
              >
                >
              </button>
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
                    marginTop: "60px",
                    backgroundColor: "#4fa2c7",
                    width: "50%",
                    height: "60%",
                    color: "#fffefa",
                    borderRadius: 20,
                    opacity: 0.97,
                    ...props.style,
                  }}
                >
                  <div className="col">
                    <div className="row align-items-center justify-content-center">
                      <Image
                        src={icop === "MikeChicken" ? "../images/MikeChickenSmall.png" : "../images/AgentToufSmall.png"}
                        className="image"
                      />
                    </div>
                    <div className="row align-items-center justify-content-center">
                      <p className="advicetext"> {questionDisplay.advice} </p>
                    </div>
                    <div className="row align-items-center justify-content-center">
                      <button
                        className="button"
                        ref={target}
                        onClick={() => {
                          setOverlayVisible(false);
                          handleNextQuestion(questionDisplay.category);
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
          </div>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username, icop: state.icop };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitLastScore: function (score) {
      dispatch({ type: "saveLastScore", score });
    },
    onSubmitDetailedScore: function (detailedScore) {
      dispatch({ type: "saveDetailedScore", detailedScore });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewScreen);
