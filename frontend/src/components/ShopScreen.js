import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/shopscreen.css";
import { connect } from "react-redux";
import { Overlay } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import NavBar from "./NavBar";

// import {
//   useFonts,
//   Montserrat_400Regular,
//   Montserrat_500Medium,
//   Montserrat_400Regular_Italic,
//   Montserrat_700Bold,
// } from "@expo-google-fonts/montserrat";

// styles des inputs et divider
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  divider: {
    width: "100%",
    margin: 0,
    marginTop: 20,
    height: 2,
    backgroundColor: "#0773a3",
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

// styles des checkboxes
const BlueCheckbox = withStyles({
  root: {
    color: "#4FA2C7",
    "&$checked": {
      color: "#0773a3",
    },
  },
  checked: {
    color: "#0773a3",
  },
})((props) => <Checkbox color="default" {...props} />);

function ShopScreen({ username }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayVisible2, setOverlayVisible2] = useState(false);
  const [userPackage, setUserPackage] = useState();
  const [packageId, setPackageId] = useState();
  const [price, setPrice] = useState();
  const [usernameCard, setUsernameCard] = useState();
  const [creditCardNumbers, setCreditCardNumbers] = useState();
  const [expirationMonth, setExpirationMonth] = useState();
  const [expirationYear, setExpirationYear] = useState();
  const [CVC, setCVC] = useState();
  const [errorInformationPayment, setErrorInformationPayment] = useState();
  const [errorPayment, setErrorPayment] = useState();
  const [listErrors, setListErrors] = useState();

  const [redirectAccount, setRedirectAccount] = useState(false);

  const classes = useStyles();

  //charge le package du user via le Back (via la BDD)
  useEffect(() => {
    console.log("je suis dans le useEffect et je veux trouver le username. username:", username);
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
    setUsernameCard("");
    setCreditCardNumbers("");
    setExpirationMonth("");
    setExpirationYear("");
    setCVC("");
  }, []);

  console.log("je suis dans le body et je trouve le username du store", username);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  const target = useRef(null);

  const toggleOverlay2 = () => {
    setOverlayVisible2(!overlayVisible2);
  };
  const target2 = useRef(null);

  //se déclenche quand le user veut changer de package et doit payer
  useEffect(() => {
    if (packageId) {
      toggleOverlay();
    }
  }, [packageId]);

  const handleSubmitPay = () => {
    let payment = false;
    const isCardValid = {
      cardnumbers: "4242424242424242",
      expMonth: 10,
      expYear: 21,
      cvc: "888",
    };
    if (usernameCard && creditCardNumbers && expirationMonth && expirationYear && CVC) {
      setErrorInformationPayment("");

      if (
        isCardValid.cardnumbers == creditCardNumbers &&
        isCardValid.expMonth == expirationMonth &&
        isCardValid.expYear == expirationYear &&
        isCardValid.cvc == CVC
      ) {
        toggleOverlay();
        toggleOverlay2();
        payment = true;
        setErrorPayment("");
      } else {
        setErrorPayment("Le paiement a échoué");
      }

      console.log("paiement true ou false", payment);
      if (payment == true) {
        console.log("Paiement", username, packageId);
        const fetchData2 = async () => {
          const data = await fetch(`/shopupdate-package?usernameFromFront=${username}&packageIdFromFront=${packageId}`);
          const body = await data.json();
          if (body.result === true) {
            setUserPackage(body.packageDataBase);
          } else {
            setListErrors(body.error);
          }
        };
        fetchData2();
      }
    } else {
      setErrorInformationPayment("Tous les champs n'ont pas été remplis");
    }
  };

  const handleSubmitChangePackage = (idPackage) => {
    const fetchData3 = async () => {
      const data = await fetch(`/shopupdate-package?usernameFromFront=${username}&packageIdFromFront=${idPackage}`);
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData3();
  };

  // déclenche la redirection vers Account si le user a choisi un nouveau package, que le paiement s'est bien passé et qu'il clique sur Ok à la fin !
  if (redirectAccount) {
    return <Redirect to="/account" />;
  }

  return (
    <div>
      <NavBar />
      <div className="container-fluid shop">
        <div className="col">
          {userPackage ? (
            <>
              <div className="row align-items-center justify-content-center mt-4">
                <p className="titleshop2">La formule Free à 0 € {userPackage.name == "Free" && "(actuelle)"}</p>
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Parcours entretien illimité"
                />
              </div>
              {userPackage.name != "Free" && (
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttonshop"
                    onClick={() => {
                      handleSubmitChangePackage("5fd776ffe2b67bdc3438888b");
                    }}
                    type="button"
                  >
                    Je la veux!
                  </button>
                </div>
              )}
              <Divider variant="middle" className={classes.divider} />
              <div className="row align-items-center justify-content-center mt-4">
                <p className="titleshop2">La formule + à 9 € {userPackage.name == "+" && "(actuelle)"}</p>
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Parcours entretien illimité"
                />
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Rapports approfondis"
                />
              </div>
              {userPackage.name != "+" && (
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttonshop"
                    onClick={() => {
                      userPackage.name == "Free" && setPrice("Payer 9,00 €");
                      userPackage.name == "Free" && setPackageId("5fd777ddab2c4ddc51207488");
                      userPackage.name == "Pro" && handleSubmitChangePackage("5fd777ddab2c4ddc51207488");
                    }}
                    type="button"
                  >
                    Je la veux!
                  </button>
                </div>
              )}
              <Divider variant="middle" className={classes.divider} />
              <div className="row align-items-center justify-content-center mt-4">
                <p className="titleshop2">La formule Pro à 19 € {userPackage.name == "Pro" && "(actuelle)"}</p>
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Parcours entretien illimité"
                />
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Rapports approfondis"
                />
              </div>
              <div className="row align-items-center justify-content-center mt-2 rowcheckbox">
                <FormControlLabel
                  value="end"
                  control={<BlueCheckbox name="checked" defaultChecked />}
                  label="Suivi avec un coach"
                />
              </div>
              {userPackage.name != "Pro" && (
                <div className="row align-items-center justify-content-center mt-2">
                  <button
                    className="buttonshop"
                    onClick={() => {
                      setPrice("Payer 19,00 €");
                      setPackageId("5fd77864b6d0a5dc87b398db");
                    }}
                    type="button"
                  >
                    Je la veux!
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="row align-items-center justify-content-center">
              <p className="textshop">{listErrors}</p>
            </div>
          )}
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
                  <p className="titleshop2">Payer par carte</p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <ValidationTextField
                    className={classes.margin}
                    label="Nom du titulaire de la carte"
                    required
                    type="text"
                    variant="outlined"
                    value={usernameCard}
                    onChange={(e) => setUsernameCard(e.target.value)}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <ValidationTextField
                    className={classes.margin}
                    label="Numéros de la carte"
                    required
                    type="text"
                    variant="outlined"
                    value={creditCardNumbers}
                    onChange={(e) => setCreditCardNumbers(e.target.value)}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <ValidationTextField
                    className={classes.margin}
                    label="Mois d'expiration"
                    required
                    type="text"
                    variant="outlined"
                    value={expirationMonth}
                    onChange={(e) => setExpirationMonth(e.target.value)}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <ValidationTextField
                    className={classes.margin}
                    label="Année d'expiration"
                    required
                    type="text"
                    variant="outlined"
                    value={expirationYear}
                    onChange={(e) => setExpirationYear(e.target.value)}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <ValidationTextField
                    className={classes.margin}
                    label="CVC"
                    required
                    type="text"
                    variant="outlined"
                    value={CVC}
                    onChange={(e) => setCVC(e.target.value)}
                  />
                </div>
                <div className="row align-items-center justify-content-center">
                  <p className="textshop">{errorInformationPayment}</p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttonshop2"
                    onClick={() => {
                      handleSubmitPay();
                    }}
                    type="button"
                  >
                    {price}
                  </button>
                </div>
                <div className="row align-items-center justify-content-center">
                  <p className="textshop">{errorPayment}</p>
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
                  <p className="titleshop2">
                    {" "}
                    Bravo {username} !{"\n"} Ton paiement s'est bien passé, {"\n"}
                    et tu as désormais accès à plus de fonctionnalités !
                  </p>
                </div>
                <div className="row align-items-center justify-content-center">
                  <button
                    className="buttonshop"
                    onClick={() => {
                      toggleOverlay2();
                      setRedirectAccount(true);
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
    //       <View style={styles.container}>
    //         <Header
    //           barStyle="light-content"
    //           centerComponent={<Text style={styles.title}>Shop</Text>}
    //           containerStyle={styles.topbar}
    //         />

    //         <ScrollView>
    //           <View style={styles.scrollview}>
    //             {userPackage ? (
    //               <>
    //                 <Text style={styles.title2}>La formule Free à 0 € {userPackage.name == "Free" && "(actuelle)"}</Text>
    //                 <CheckBox
    //                   title="Parcours entretien illimité"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 {userPackage.name != "Free" && (
    //                   <Button
    //                     title="Je la veux!"
    //                     titleStyle={styles.textbutton}
    //                     onPress={() => handleSubmitChangePackage("5fd776ffe2b67bdc3438888b")}
    //                     buttonStyle={styles.button}
    //                   />
    //                 )}
    //                 <Divider style={styles.divider} />
    //                 <Text style={styles.title2}>La formule + à 9 € {userPackage.name == "+" && "(actuelle)"}</Text>
    //                 <CheckBox
    //                   title="Parcours entretien illimité"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 <CheckBox
    //                   title="Rapports approfondis"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 {userPackage.name != "+" && (
    //                   <Button
    //                     title="Je la veux!"
    //                     titleStyle={styles.textbutton}
    //                     onPress={() => {
    //                       userPackage.name == "Free" && setPrice("Payer 9,00 €");
    //                       userPackage.name == "Free" && setPackageId("5fd777ddab2c4ddc51207488");
    //                       userPackage.name == "Pro" && handleSubmitChangePackage("5fd777ddab2c4ddc51207488");
    //                     }}
    //                     buttonStyle={styles.button}
    //                   />
    //                 )}
    //                 <Divider style={styles.divider} />
    //                 <Text style={styles.title2}>La formule Pro à 19 € {userPackage.name == "Pro" && "(actuelle)"}</Text>
    //                 <CheckBox
    //                   title="Parcours entretien illimité"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 <CheckBox
    //                   title="Rapports approfondis"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 <CheckBox
    //                   title="Suivi avec un coach"
    //                   checked={true}
    //                   containerStyle={styles.checkbox}
    //                   textStyle={styles.text}
    //                   checkedColor="#0773A3"
    //                   uncheckedColor="#4FA2C7"
    //                 />
    //                 {userPackage.name != "Pro" && (
    //                   <Button
    //                     title="Je la veux!"
    //                     titleStyle={styles.textbutton}
    //                     onPress={() => {
    //                       setPrice("Payer 19,00 €");
    //                       setPackageId("5fd77864b6d0a5dc87b398db");
    //                     }}
    //                     buttonStyle={styles.button}
    //                   />
    //                 )}
    //               </>
    //             ) : (
    //               <Text style={styles.text}>{listErrors}</Text>
    //             )}

    //             <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
    //               <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
    //                 <ScrollView style={styles.overlay}>
    //                   <Text style={styles.title2}>Payer par carte</Text>
    //                   <TextInput
    //                     placeholder="Nom du titulaire de la carte"
    //                     label="Nom du titulaire de la carte"
    //                     onChangeText={(usernamecard) => setUsernameCard(usernamecard)}
    //                     value={usernameCard}
    //                     style={styles.input}
    //                     mode="outlined"
    //                   />
    //                   <TextInput
    //                     placeholder="Numéros de la carte"
    //                     label="Numéros de la carte"
    //                     onChangeText={(creditcardnumbers) => setCreditCardNumbers(creditcardnumbers)}
    //                     value={creditCardNumbers}
    //                     style={styles.input}
    //                     mode="outlined"
    //                   />
    //                   <TextInput
    //                     placeholder="Mois d'expiration"
    //                     label="Mois d'expiration"
    //                     onChangeText={(expirationmonth) => setExpirationMonth(expirationmonth)}
    //                     value={expirationMonth}
    //                     style={styles.input}
    //                     mode="outlined"
    //                   />
    //                   <TextInput
    //                     placeholder="Année d'expiration"
    //                     label="Année d'expiration"
    //                     onChangeText={(expirationyear) => setExpirationYear(expirationyear)}
    //                     value={expirationYear}
    //                     style={styles.input}
    //                     mode="outlined"
    //                   />
    //                   <TextInput
    //                     placeholder="CVC"
    //                     label="CVC"
    //                     onChangeText={(cvc) => setCVC(cvc)}
    //                     value={CVC}
    //                     style={styles.input}
    //                     mode="outlined"
    //                   />

    //                   <Text style={styles.text}>{errorInformationPayment}</Text>
    //                   <Button
    //                     title={price}
    //                     titleStyle={styles.textbutton2}
    //                     buttonStyle={styles.button2}
    //                     onPress={() => {
    //                       handleSubmitPay();
    //                     }}
    //                   />
    //                   <Text style={styles.text}>{errorPayment}</Text>
    //                 </ScrollView>
    //               </KeyboardAvoidingView>
    //             </Overlay>

    //             <Overlay isVisible={overlayVisible2} overlayStyle={styles.overlay}>
    //               <View style={styles.overlay2}>
    //                 <Text style={styles.title2}>
    //                   Bravo {username} !{"\n"} Ton paiement s'est bien passé, {"\n"}
    //                   et tu as désormais accès à plus de fonctionnalités !
    //                 </Text>
    //                 <Button
    //                   title="OK"
    //                   titleStyle={styles.textbutton2}
    //                   buttonStyle={styles.button}
    //                   onPress={() => {
    //                     toggleOverlay2();
    //                     navigation.navigate("Account");
    //                   }}
    //                 />
    //               </View>
    //             </Overlay>
    //           </View>
    //         </ScrollView>
    //       </View>
  );
}

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

export default connect(mapStateToProps, null)(ShopScreen);
