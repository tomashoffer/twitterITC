import React, { useState, useContext, useCallback } from "react";
import { withRouter, Redirect } from "react-router";
import AuthContext from "../context/auth/AuthContext";
import app from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import style from "../style/LogIn.module.css";

const LogIn = ({ history }) => {
  const [logInState, setLogInState] = useState({
    email: "",
    password: "",
  });
  const {
    currentUser,
    setGeneralTweets,
    addGoogleUserToDb,
  } = useContext(AuthContext);

  const emailLogIn = (e) => {
    setLogInState({
      ...logInState,
      [e.target.name]: e.target.value,
    });
  };

  const passLogIn = (e) => {
    setLogInState({
      ...logInState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const email = logInState.email;
      const password = logInState.password;
      // console.log(email, password);
      try {
        let user = await app.auth().signInWithEmailAndPassword(email, password);
        history.push("/");
        console.log("sign up succesfully");
        localStorage.setItem(
          "userId",
          JSON.stringify(user.user.multiFactor.user.uid)
        );
      } catch (error) {
        console.log(error);
      }
    },
    [logInState.email, logInState.password, history]
  );

  if (currentUser) {
    setGeneralTweets(true);
    return <Redirect to="/" />;
  }

  // Google Provider Log In

  const googleLogIn = (e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        localStorage.setItem("userId", JSON.stringify(user.uid));
        addGoogleUserToDb({
          authId: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          followers: 0,
          following: 0,
          usersFollowing: "",
          usersFollowers: "",
        });
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log("errorCode:", errorCode);
        console.log("errorMessage:", errorMessage);
        console.log("email:", email);
        console.log("credential:", credential);
      });
  };

  return (
    <div className={style.containerLogIn}>
      <div className={style.titleDiv}>
        <h1 className={style.title}>Welcome to TweetBlog</h1>
        <h3 className={style.signin}>Sign In</h3>
      </div>
      <form className={style.form} onSubmit={handleSignUp}>
        <input
          type="email"
          value={logInState.email}
          name="email"
          placeholder="Email"
          onChange={emailLogIn}
          className={style.inputLogIn}
        />
        <input
          type="password"
          value={logInState.password}
          name="password"
          placeholder="Password"
          onChange={passLogIn}
          className={style.inputLogIn}
        />

        <div className={style.buttonForm}>
          <button type="submit" className={style.button}>
            Log in with Email
          </button>
          <button className={style.googleBtn} onClick={googleLogIn}>
            Log in with Google
          </button>
          {/* <button className={style.signUp}> */}
          <a href="/signup" className={style.signUp}>
            <p className={style.register}>Register</p>
          </a>
          {/* </button> */}
        </div>
      </form>
    </div>
  );
};

export default withRouter(LogIn);
