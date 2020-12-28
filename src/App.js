import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import WelcomeScreen from "./components/WelcomeScreen";
import LoginScreen from "./components/LoginScreen";
import PasswordRecoveryScreen from "./components/PasswordRecoveryScreen";
import HomeScreen from "./components/HomeScreen";
import AccountScreen from "./components/AccountScreen";
import ChatScreen from "./components/ChatScreen";
import InterviewScreenHome from "./components/InterviewScreenHome";
import InterviewScreen from "./components/InterviewScreen";
import InterviewScreenResult from "./components/InterviewScreenResult";
import AdvicesScreen from "./components/AdvicesScreen";
import ShopScreen from "./components/ShopScreen";

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import username from "./reducers/username.reducer";
import score from "./reducers/score.reducer";
import detailedscore from "./reducers/detailedscore.reducer";
import job from "./reducers/job.reducer";
import county from "./reducers/county.reducer";
import icop from "./reducers/icop.reducer";

const store = createStore(combineReducers({ username, score, detailedscore, job, county, icop }));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={WelcomeScreen} />
          <Route path="/login" exact component={LoginScreen} />
          <Route path="/passwordrecovery" exact component={PasswordRecoveryScreen} />
          <Route path="/home" exact component={HomeScreen} />
          <Route path="/account" exact component={AccountScreen} />
          <Route path="/chat" exact component={ChatScreen} />
          <Route path="/interviewscreenhome" exact component={InterviewScreenHome} />
          <Route path="/interviewscreen" exact component={InterviewScreen} />
          <Route path="/interviewscreenresult" exact component={InterviewScreenResult} />
          <Route path="/advices" exact component={AdvicesScreen} />
          <Route path="/shop" exact component={ShopScreen} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
