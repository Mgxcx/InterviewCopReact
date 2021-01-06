import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/shopscreen.css";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import NavBar from "./NavBar";

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

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const toggleOverlay2 = () => {
    setOverlayVisible2(!overlayVisible2);
  };

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
        <Modal
          show={overlayVisible}
          dialogClassName="overlaydialogshop"
          contentClassName="overlaycontentshop"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          size="lg"
        >
          <Modal.Body>
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
          </Modal.Body>
        </Modal>

        <Modal
          show={overlayVisible2}
          dialogClassName="overlaydialogshop"
          contentClassName="overlaycontentshop"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          size="lg"
        >
          <Modal.Body>
            <div className="col">
              <div className="row align-items-center justify-content-center">
                <p className="titleshop2">
                  {" "}
                  Bravo {username} ! Ton paiement s'est bien passé, et tu as désormais accès à plus de fonctionnalités !
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
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

export default connect(mapStateToProps, null)(ShopScreen);
