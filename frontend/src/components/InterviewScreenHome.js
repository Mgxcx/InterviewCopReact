import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/interviewscreenhome.css";
import { connect } from "react-redux";
import { Image, Overlay } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

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
  },
})(TextField);

// styles des radios buttons
const BlueRadio = withStyles({
  root: {
    color: "#4FA2C7",
    "&$checked": {
      color: "#0773a3",
    },
  },
  checked: {
    color: "#0773a3",
  },
})((props) => <Radio color="default" {...props} />);

function InterviewScreenHome({ username, onSubmitJob, onSubmitCounty, onSubmitIcop }) {
  const [job, setJob] = useState("");
  const [salary, setSalary] = useState("");
  const [county, setCounty] = useState("Choisissez votre région");
  const [icop, setIcop] = useState("Choisissez votre iCop");

  const [listErrorsNewInformation, setListErrorsNewInformation] = useState(); //les messages d'erreur sont transmis par le Back

  //état gérant l'overlay pour choisir la region
  const [overlayVisible, setOverlayVisible] = useState(false);
  const target = useRef(null);

  //état gérant l'overlay pour choisir l'icop
  const [overlayVisibleTwo, setOverlayVisibleTwo] = useState(false);
  const target2 = useRef(null);

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
          <div className="row align-items-center justify-content-center">
            <ValidationTextField
              className={classes.margin}
              label="Salaire souhaité"
              required
              type="number"
              variant="outlined"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="button2"
              ref={target}
              onClick={() => {
                setOverlayVisible(true);
              }}
              type="button"
            >
              {county}
            </button>
          </div>

          <div className="row align-items-center justify-content-center">
            <button
              className="button2"
              ref={target2}
              onClick={() => {
                setOverlayVisibleTwo(true);
              }}
              type="button"
            >
              {icop}
            </button>
          </div>
          <div className="row align-items-center justify-content-center">
            <p className="text2">{listErrorsNewInformation}</p>
          </div>
          <div className="row align-items-center justify-content-center">
            <button
              className="button3"
              onClick={() => {
                handleSubmitNewInformation();
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
                  borderColor: "#0773a3",
                  marginTop: "60px",
                  backgroundColor: "#fffefa",
                  width: "50%",
                  height: "60%",
                  color: "#0773a3",
                  borderRadius: 3,
                  ...props.style,
                }}
              >
                <div className="col">
                  <div className="row align-items-center justify-content-center">
                    <p className="regiontitle">Sélectionnez votre région</p>
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Auvergne-Rhone-Alpes"}
                          value="Auvergne-Rhone-Alpes"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Auvergne-Rhone-Alpes" }}
                        />
                      }
                      label="Auvergne-Rhone-Alpes"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Bourgogne-Franche-Comte"}
                          value="Bourgogne-Franche-Comte"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Bourgogne-Franche-Comte" }}
                        />
                      }
                      label="Bourgogne-Franche-Comte"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Bretagne"}
                          value="Bretagne"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Bretagne" }}
                        />
                      }
                      label="Bretagne"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Centre-Val de Loire"}
                          value="Centre-Val de Loire"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Centre-Val de Loire" }}
                        />
                      }
                      label="Centre-Val de Loire"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Corse"}
                          value="Corse"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Corse" }}
                        />
                      }
                      label="Corse"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Grand Est"}
                          value="Grand Est"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Grand Est" }}
                        />
                      }
                      label="Grand Est"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Hauts-de-France"}
                          value="Hauts-de-France"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Hauts-de-France" }}
                        />
                      }
                      label="Hauts-de-France"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Ile-de-France"}
                          value="Ile-de-France"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Ile-de-France" }}
                        />
                      }
                      label="Ile-de-France"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Normandie"}
                          value="Normandie"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Normandie" }}
                        />
                      }
                      label="Normandie"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Nouvelle-Aquitaine"}
                          value="Nouvelle-Aquitaine"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Nouvelle-Aquitaine" }}
                        />
                      }
                      label="Nouvelle-Aquitaine"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Occitanie"}
                          value="Occitanie"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Occitanie" }}
                        />
                      }
                      label="Occitanie"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Pays de la Loire"}
                          value="Pays de la Loire"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Pays de la Loire" }}
                        />
                      }
                      label="Pays de la Loire"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "Provence-Alpes-Cote d'Azur"}
                          value="Provence-Alpes-Cote d'Azur"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "Provence-Alpes-Cote d'Azur" }}
                        />
                      }
                      label="Provence-Alpes-Cote d'Azur"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <FormControlLabel
                      value="end"
                      control={
                        <BlueRadio
                          checked={county === "DOM-TOM"}
                          value="DOM-TOM"
                          onChange={(e) => setCounty(e.target.value)}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "DOM-TOM" }}
                        />
                      }
                      label="DOM-TOM"
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <button
                      className="button"
                      ref={target}
                      onClick={() => {
                        setOverlayVisible(false);
                      }}
                      type="button"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Overlay>
          <Overlay target={target2.current} show={overlayVisibleTwo}>
            {({ arrowProps, show: _show, popper, ...props }) => (
              <div
                {...props}
                style={{
                  display: "flex",
                  position: "absolute",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#0773a3",
                  marginTop: "60px",
                  backgroundColor: "#fffefa",
                  width: "50%",
                  height: "60%",
                  color: "#0773a3",
                  borderRadius: 3,
                  ...props.style,
                }}
              >
                <div className="col">
                  <div className="row align-items-center justify-content-center">
                    <Image
                      src="../images/MikeChickenSmall.png"
                      onClick={() => setIcop("MikeChicken")}
                      className={icop === "MikeChicken" ? "imageIcopSelected" : "imageIcop"}
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <p className="text2">Nom : Mike Chicken</p>
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <p className="text2">Difficulté: Moyenne</p>
                  </div>

                  <div className="row align-items-center justify-content-center">
                    <Image
                      src="../images/AgentToufSmall.png"
                      onClick={() => setIcop("AgentTouf")}
                      className={icop === "AgentTouf" ? "imageIcopSelected" : "imageIcop"}
                    />
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <p className="text2">Nom : Agent Touf</p>
                  </div>
                  <div className="row align-items-center justify-content-center">
                    <p className="text2">Difficulté: Élevée</p>
                  </div>

                  <div className="row align-items-center justify-content-center">
                    <button
                      className="button"
                      ref={target}
                      onClick={() => {
                        setOverlayVisibleTwo(false);
                      }}
                      type="button"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Overlay>
        </div>
      </div>
    </div>
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
