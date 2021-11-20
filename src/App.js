import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import FormTweet from "./components/FormTweet";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import AuthState from "./context/auth/AuthState";
import UserState from "./context/user/UserState";
import AlertState from "./context/alert/AlertState";
import TweetState from "./context/tweet/TweetState";
import SpinnerState from "./context/spinner/SpinnerState";
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function App() {
  return (
    <AuthState>
      <SpinnerState>
        <UserState>
          <TweetState>
            <AlertState>
              <Router>
                <PrivateRoute exact path="/" component={FormTweet} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/profile/:id" component={Profile} />
                <Route exact path="/login" component={LogIn} />
                <Route exact path="/signup" component={SignUp} />
              </Router>
            </AlertState>
          </TweetState>
        </UserState>
      </SpinnerState>
    </AuthState>
  );
}
