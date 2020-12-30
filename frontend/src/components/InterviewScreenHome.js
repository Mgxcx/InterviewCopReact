import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/interviewscreenhome.css";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

// import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native";
// import { Button, CheckBox, Header, Overlay } from "react-native-elements";
// import { TextInput } from "react-native-paper";
// import AppLoading from "expo-app-loading";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";
// import Svg, { Path } from "react-native-svg";
// import { moderateScale } from "react-native-size-matters";

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

function InterviewScreenHome({ username, onSubmitJob, onSubmitCounty, onSubmitIcop }) {
  //   const image = require("../assets/MikeChickenLeft.png");
  const [job, setJob] = useState("");
  const [salary, setSalary] = useState("");
  const [county, setCounty] = useState("Choisissez votre région");
  const [icop, setIcop] = useState("Choisissez votre iCop");

  const [listErrorsNewInformation, setListErrorsNewInformation] = useState(); //les messages d'erreur sont transmis par le Back

  //état et fonction gérant l'overlay pour choisir la region
  const [overlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  //état et fonction gérant l'overlay pour choisir l'icop
  const [overlayVisibleTwo, setOverlayVisibleTwo] = useState(false);
  const toggleOverlayTwo = () => {
    setOverlayVisibleTwo(!overlayVisibleTwo);
  };

  //   const imageMikeChicken = require("../assets/MikeChickenSmall.png");
  //   const imageAgentTouf = require("../assets/AgentToufSmall.png");

  //   //pour gérer les polices expo-google-fonts
  //   let [fontsLoaded] = useFonts({
  //     Montserrat_500Medium,
  //     Montserrat_400Regular,
  //     Montserrat_400Regular_Italic,
  //     Montserrat_700Bold,
  //   });

  const [redirectInterview, setRedirectInterview] = useState(false);

  //styles des inputs
  const classes = useStyles();

  //Process NewInformation : se déclenche via le bouton "suivant" après les inputs des nouvelles informations
  //ajoute ou modifie les données du user relatives à son métier, son expérience, son salaire et son département dans la BDD via le Back
  const handleSubmitNewInformation = async () => {
    const data = await fetch("/update-userdata", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${username}&jobFromFront=${job}&salaryFromFront=${salary}&countyFromFront=${county}`,
    });

    const body = await data.json();

    if (body.result === true) {
      onSubmitJob(job);
      onSubmitCounty(county);
      onSubmitIcop(icop);
      setRedirectInterview(true);
    } else {
      setListErrorsNewInformation(body.error);
    }
  };

  // déclenche la redirection vers la page Interview Screen si le user a rempli toutes les informations comme il faut et a cliqué sur le bouton suivant!
  if (redirectInterview) {
    return <Redirect to="/interviewscreen" />;
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
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a className="nav-link linkstyle" href="#">
                Accueil <span class="sr-only">(current)</span>
              </a>
            </li>

            <li class="nav-item">
              <a className="nav-link linkstyle" href="/account">
                Mon Compte
              </a>
            </li>
            <li class="nav-item">
              <a className="nav-link linkstyle" href="/interviewscreenhome">
                Entretien
              </a>
            </li>

            <li class="nav-item">
              <a className="nav-link linkstyle" href="/advices">
                Conseils
              </a>
            </li>

            <li class="nav-item">
              <a className="nav-link linkstyle" href="/shop">
                Shop
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid home">
        <div className="col">
          <div className="row align-items-center justify-content-center">
            <div className="boxchat arrowchat m-5 ">
              Bonjour, {username} ! {"\n"}
              Ravi de vous voir !{"\n"}
              Vous allez devoir répondre à une série de 10 questions !
            </div>
            <Image src="../images/MikeChickenLeft.png" className="image" />
          </div>

          <div className="row align-items-center justify-content-center">
            <p className="title2">Quelques infos sur vous avant de commencer !</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <ValidationTextField
              className={classes.margin}
              label="Métier recherché"
              required
              type="text"
              variant="outlined"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
    //       <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
    //         <Header
    //           barStyle="light-content"
    //           centerComponent={<Text style={styles.title}>Entretien</Text>}
    //           containerStyle={styles.topbar}
    //         />

    //         <ScrollView>
    //           <View style={styles.icoppresentation}>
    //             <View style={[styles.bubble, styles.bubbleOut]}>
    //               <View style={[styles.balloon, { backgroundColor: "#0773A3" }]}>
    //                 <Text style={styles.text}>
    //                   Bonjour, {username} ! {"\n"} Ravi de vous voir !{"\n"}
    //                   Vous allez devoir répondre à une série de 10 questions !
    //                 </Text>
    //                 <View style={[styles.arrowContainer, styles.arrowRightContainer]}>
    //                   <Svg
    //                     style={styles.arrowRight}
    //                     width={moderateScale(15.5, 0.6)}
    //                     height={moderateScale(17.5, 0.6)}
    //                     viewBox="32.485 17.5 15.515 17.5"
    //                     enable-background="new 32.485 17.5 15.515 17.5"
    //                   >
    //                     <Path d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z" fill="#0773A3" x="0" y="0" />
    //                   </Svg>
    //                 </View>
    //               </View>
    //             </View>
    //             <Image source={image} style={styles.image} />
    //           </View>
    //           <View style={styles.information}>
    //             <Text style={styles.title2}> Quelques infos sur vous avant de commencer ! </Text>
    //             <TextInput
    //               placeholder="Métier recherché"
    //               label="Métier recherché"
    //               onChangeText={(job) => setJob(job)}
    //               value={job}
    //               style={styles.input}
    //               mode="outlined"
    //             />

    //             <TextInput
    //               placeholder="Salaire souhaité"
    //               label="Salaire souhaité"
    //               onChangeText={(salary) => setSalary(salary)}
    //               value={salary}
    //               style={styles.input}
    //               mode="outlined"
    //             />

    //             <Button title={county} onPress={toggleOverlay} buttonStyle={styles.selectionbutton} />

    //             <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
    //               <ScrollView>
    //                 <View style={styles.regionview}>
    //                   <Text style={styles.regiontitle}>Sélectionnez votre région</Text>
    //                   <CheckBox
    //                     title="Auvergne-Rhone-Alpes"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Auvergne-Rhone-Alpes" ? true : false}
    //                     onPress={() => setCounty("Auvergne-Rhone-Alpes")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Bourgogne-Franche-Comte"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Bourgogne-Franche-Comte" ? true : false}
    //                     onPress={() => setCounty("Bourgogne-Franche-Comte")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Bretagne"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Bretagne" ? true : false}
    //                     onPress={() => setCounty("Bretagne")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Centre-Val de Loire"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Centre-Val de Loire" ? true : false}
    //                     onPress={() => setCounty("Centre-Val de Loire")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Corse"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Corse" ? true : false}
    //                     onPress={() => setCounty("Corse")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Grand Est"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Grand Est" ? true : false}
    //                     onPress={() => setCounty("Grand Est")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Hauts-de-France"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Hauts-de-France" ? true : false}
    //                     onPress={() => setCounty("Hauts-de-France")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Ile-de-France"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Ile-de-France" ? true : false}
    //                     onPress={() => setCounty("Ile-de-France")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Normandie"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Normandie" ? true : false}
    //                     onPress={() => setCounty("Normandie")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Nouvelle-Aquitaine"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Nouvelle-Aquitaine" ? true : false}
    //                     onPress={() => setCounty("Nouvelle-Aquitaine")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Occitanie"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Occitanie" ? true : false}
    //                     onPress={() => setCounty("Occitanie")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Pays de la Loire"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Pays de la Loire" ? true : false}
    //                     onPress={() => setCounty("Pays de la Loire")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="Provence-Alpes-Cote d'Azur"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "Provence-Alpes-Cote d'Azur" ? true : false}
    //                     onPress={() => setCounty("Provence-Alpes-Cote d'Azur")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <CheckBox
    //                     title="DOM-TOM"
    //                     textStyle={styles.text2}
    //                     checkedColor="#0773A3"
    //                     uncheckedColor="#4FA2C7"
    //                     checkedIcon="dot-circle-o"
    //                     uncheckedIcon="circle-o"
    //                     checked={county === "DOM-TOM" ? true : false}
    //                     onPress={() => setCounty("DOM-TOM")}
    //                     containerStyle={styles.checkbox}
    //                   />
    //                   <Button buttonStyle={styles.button} onPress={toggleOverlay} title="OK" />
    //                 </View>
    //               </ScrollView>
    //             </Overlay>

    //             <Button title={icop} onPress={toggleOverlayTwo} buttonStyle={styles.selectionbutton} />

    //             <Overlay isVisible={overlayVisibleTwo} overlayStyle={styles.overlay}>
    //               <ScrollView contentContainerStyle={styles.contentContainer}>
    //                 <Text style={styles.regiontitle}>Sélectionnez votre iCop</Text>

    //                 <TouchableOpacity style={styles.contentContainer} onPress={() => setIcop("MikeChicken")}>
    //                   <Image
    //                     source={imageMikeChicken}
    //                     style={icop === "MikeChicken" ? styles.imageIcopSelected : styles.imageIcop}
    //                   />
    //                   <Text style={styles.text2}>Nom: Mike Chicken</Text>
    //                   <Text style={styles.text2}>Difficulté : Moyenne</Text>
    //                 </TouchableOpacity>

    //                 <TouchableOpacity style={styles.contentContainer} onPress={() => setIcop("AgentTouf")}>
    //                   <Image
    //                     source={imageAgentTouf}
    //                     style={icop === "AgentTouf" ? styles.imageIcopSelected : styles.imageIcop}
    //                   />
    //                   <Text style={styles.text2}>Nom: Agent Touf</Text>
    //                   <Text style={styles.text2}>Difficulté : Élevée</Text>
    //                 </TouchableOpacity>

    //                 <Button buttonStyle={styles.button} onPress={toggleOverlayTwo} title="OK" />
    //               </ScrollView>
    //             </Overlay>
    //             <Text style={styles.text2}>{listErrorsNewInformation}</Text>
    //             <Button
    //               icon={<Ionicons name="ios-arrow-forward" size={24} color="#FFFEFE" />}
    //               onPress={() => {
    //                 handleSubmitNewInformation();
    //               }}
    //               buttonStyle={styles.buttonnext}
    //             />
    //           </View>
    //         </ScrollView>
    //       </KeyboardAvoidingView>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitJob: function (job) {
      dispatch({ type: "saveJob", job });
    },
    onSubmitCounty: function (county) {
      dispatch({ type: "saveCounty", county });
    },
    onSubmitIcop: function (icop) {
      dispatch({ type: "saveIcop", icop });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewScreenHome);
