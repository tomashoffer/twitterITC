import React from "react";
import Barra from "./components/Barra";
import FormTweet from "./components/FormTweet";
import ListTweet from "./components/ListTweet";
import AlertState from "./context/alert/AlertState";
import TweetState from "./context/tweet/tweetState";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <TweetState>
      <AlertState>
        <Router>
          <Barra />
          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/">
              <FormTweet />
              <ListTweet />
            </Route>
          </Switch>
        </Router>
      </AlertState>
    </TweetState>
  );
}
