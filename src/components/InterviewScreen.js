import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import AppLoading from "expo-app-loading";
import { Button, Header, Overlay } from "react-native-elements";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

function InterviewScreen({ navigation, username, onSubmitLastScore, onSubmitDetailedScore, icop }) {
  const [questionNumber, setQuestionNumber] = useState(1); //compteur des questions affiché sur la top bar entretien
  const [questionList, setQuestionList] = useState(); //stocke les données des questions envoyées par le back (questions,réponses,conseils etc)

  const [tempScore, setTempScore] = useState(0); //score temporaire associé à la réponse actuellement sélectionnée (pas encore confirmée par le user)

  const [score, setScore] = useState([]); //lorsque la réponse est confirmée par le user, le score final est incrémenté
  const [category, setCategory] = useState([]); //lorsque la réponse est confirmée par le user, la liste des categories de questions est enregistrée (pour envoi dans redux à la fin)

  //états liés aux réponses, un état passe à true si la réponse associée est sélectionnée par le user
  const [answerA, setAnswerA] = useState(false);
  const [answerB, setAnswerB] = useState(false);
  const [answerC, setAnswerC] = useState(false);
  const [answerD, setAnswerD] = useState(false);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const imageMikeChicken = require("../assets/MikeChickenSmall.png");
  const imageAgentTouf = require("../assets/AgentToufSmall.png");

  const urlBack = "https://interviewcopprod.herokuapp.com";

  //pour gérer les polices expo-google-fonts
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
  });

  //charge les questions (générées aléatoirement par le backend)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${urlBack}/generate-questions?icop=${icop}`);
      const body = await data.json();
      if (body.result === true) {
        setQuestionList(body.questionsArray);
      }
    };
    fetchData();
  }, []);

  //déclenche handleSubmitLastQuestion après la dernière question
  useEffect(() => {
    score.length === 10 && handleSubmitLastQuestion();
  }, [score]);

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
    // console.log('cette réponse vaut '+points+' points');
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
    const data = await fetch(`${urlBack}/interviewsave-scoreandtrophy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&scoreFromFront=${finalScore}`,
    });
    const body = await data.json();
    if (body.result === true) {
      onSubmitLastScore(finalScore); //envoie le score total dans redux
      onSubmitDetailedScore({ score, category }); //envoie le resultat de chaque question dans redux
      navigation.navigate("InterviewScreenResult");
    }
  };

  if (!questionList || !fontsLoaded) {
    return <AppLoading></AppLoading>;
  }

  let questionDisplay = questionList[questionNumber - 1]; //lorsque le compteur des questions s'actualise, la question suivante est chargée

  return (
    <View style={styles.container}>
      <Header
        barStyle="light-content"
        leftComponent={<Text style={styles.title}>{questionNumber}/10</Text>}
        centerComponent={<Text style={styles.title}>Entretien</Text>}
        containerStyle={styles.topbar}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title2}> {questionDisplay.question} </Text>
        <Button
          title={questionDisplay.answers[0].text}
          titleStyle={styles.textbutton}
          onPress={() => handleSelectedAnswer("A", questionDisplay.answers[0].points)}
          buttonStyle={answerA ? styles.buttonSelected : styles.button}
        />
        <Button
          title={questionDisplay.answers[1].text}
          titleStyle={styles.textbutton}
          onPress={() => handleSelectedAnswer("B", questionDisplay.answers[1].points)}
          buttonStyle={answerB ? styles.buttonSelected : styles.button}
        />
        <Button
          title={questionDisplay.answers[2].text}
          titleStyle={styles.textbutton}
          onPress={() => handleSelectedAnswer("C", questionDisplay.answers[2].points)}
          buttonStyle={answerC ? styles.buttonSelected : styles.button}
        />
        <Button
          title={questionDisplay.answers[3].text}
          titleStyle={styles.textbutton}
          onPress={() => handleSelectedAnswer("D", questionDisplay.answers[3].points)}
          buttonStyle={answerD ? styles.buttonSelected : styles.button}
        />
        <Button
          icon={<Ionicons name="ios-arrow-forward" size={24} color="#FFFEFE" />}
          onPress={() => toggleOverlay()}
          buttonStyle={styles.nextButton}
        />
      </ScrollView>
      <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
        <ScrollView style={styles.overlay}>
          <Image source={icop === "MikeChicken" ? imageMikeChicken : imageAgentTouf} style={styles.image} />
          <Text style={styles.advicetext}> {questionDisplay.advice} </Text>
          <Button
            buttonStyle={styles.adviceokbutton}
            onPress={() => {
              toggleOverlay();
              handleNextQuestion(questionDisplay.category);
            }}
            title="OK"
          />
        </ScrollView>
      </Overlay>
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFEFA",
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    color: "#FFFEFA",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
  },
  title2: {
    color: "#0773A3",
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    textAlign: "center",
  },
  topbar: {
    backgroundColor: "#0773A3",
    marginBottom: 10,
  },
  image: {
    width: 130,
    height: 130,
    alignSelf: "center",
  },
  button: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#4FA2C7",
    borderRadius: 15,
  },
  buttonSelected: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#E8C518",
    borderRadius: 15,
  },
  nextButton: {
    backgroundColor: "#0773A3",
    borderRadius: 15,
    margin: 15,
    width: 80,
  },
  textbutton: {
    color: "#FFFEFE",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 29,
    alignItems: "center",
    textAlign: "center",
    letterSpacing: 0.75,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    color: "#FFFEFE",
    textAlign: "center",
    padding: 5,
  },
  input: {
    borderColor: "#0773A3",
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    backgroundColor: "#FFFEFA",
    color: "#0773A3",
    height: 40,
    width: 280,
  },
  advicetext: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    color: "#FFFEFE",
    textAlign: "center",
  },
  adviceokbutton: {
    color: "#FFFEFE",
    backgroundColor: "#0773A3",
    fontFamily: "Montserrat_500Medium",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.75,
    height: 40,
    width: 80,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  overlay: {
    backgroundColor: "#4FA2C7",
    width: "90%",
    height: "65%",
    borderRadius: 20,
    opacity: 0.95,
    alignSelf: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InterviewScreen);
