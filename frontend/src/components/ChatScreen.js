import React, { useState, useEffect } from "react";
import "../stylesheets/chatscreen.css";
import NavBar from "./NavBar";
import { connect } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import socketIOClient from "socket.io-client";

const socket = socketIOClient();

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
      width: "100vh",
      maxWidth: "600px",
    },
  },
})(TextField);

function ChatScreen({ username }) {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [listMessage, setListMessage] = useState([]);

  //styles des inputs
  const classes = useStyles();

  useEffect(() => {
    socket.emit("sendWelcomeMessage", { currentMessage: "", username });
  }, []);

  useEffect(() => {
    socket.on("welcomeMessage", (newMessage) => {
      var regexSmile = /:\)/;
      var newStr = newMessage.currentMessage.replace(regexSmile, "\u263A");
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
    socket.on("sendMessageToAll", (newMessage) => {
      var regexSmile = /:\)/;
      var regexSad = /:\(/;
      var regexLangue = /:\p/;
      var regexFuck = /fuck[a-z]*/i;
      var newStr = newMessage.currentMessage
        .replace(regexSmile, "\u263A")
        .replace(regexSad, "\u2639")
        .replace(regexLangue, "\uD83D\uDE1B")
        .replace(regexFuck, "\u2022\u2022\u2022");
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
  }, [listMessage]);

  const affichageMessages = listMessage.map((e, i) => {
    if (e.username != username) {
      return (
        <div className="row align-items-center justify-content-end" key={i}>
          <div className="boxchat1 arrowchat1 m-3">
            {e.currentMessage}
            <p className="smalltextchat">{e.username}</p>
          </div>
        </div>
      );
    } else
      return (
        <div className="row align-items-center justify-content-start" key={i}>
          <div className="boxchat2 arrowchat2 m-3">
            {e.currentMessage}
            <p className="smalltextchat">{e.username}</p>
          </div>
        </div>
      );
  });

  return (
    <div>
      <NavBar />
      <div className="container-fluid chat">
        <div className="col-8">
          <div className="row align-items-center justify-content-center mt-4">
            <p className="titlechat">Chat</p>
          </div>
          {affichageMessages}
          <div className="row align-items-end justify-content-center">
            <ValidationTextField
              className={classes.margin}
              label="Tapez votre message ici"
              required
              type="text"
              variant="outlined"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
          </div>
          <div className="row align-items-end justify-content-center">
            <button
              className="buttonchat"
              onClick={() => {
                socket.emit("sendMessage", { currentMessage, username });
                setCurrentMessage("");
              }}
              type="button"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

export default connect(mapStateToProps, null)(ChatScreen);
