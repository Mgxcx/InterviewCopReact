import React, { useState, useEffect } from "react";
import "../stylesheets/advicesscreen.css";
import NavBar from "./NavBar";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

//styles des accordions
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    borderRadius: 15,
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#0773a3",
    color: "#fffefa",
    borderRadius: "15px",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#fffefa",
  },
}))(MuiAccordionDetails);

function AdvicesScreen() {
  //déclenche le setAdvices au chargement de la page pour récupérer les conseils stockés en BDD
  const [advices, setAdvices] = useState();

  const [expanded, setExpanded] = useState("");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    const getAdvices = async () => {
      const data = await fetch("/advices");
      const body = await data.json();
      if (body.result === true) {
        setAdvices(body.advices);
      }
    };
    getAdvices();
  }, []);

  let advicesList;
  if (advices) {
    advicesList = advices.map((e, i) => (
      <Accordion key={i} square expanded={expanded === e.title} onChange={handleChange(e.title)}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon style={{ color: "#fffefa" }} />}
        >
          <Typography>{e.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="textadvice">{e.content}</Typography>
        </AccordionDetails>
      </Accordion>
    ));
  }

  return (
    <div>
      <NavBar />
      <div className="container-fluid advices">
        <div className="col">
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titleadvices">Conseils</p>
          </div>
          <div className="advices">{advicesList}</div>
        </div>
      </div>
    </div>
  );
}

export default AdvicesScreen;
