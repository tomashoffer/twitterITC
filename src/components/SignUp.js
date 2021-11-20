import React, { useState, useContext, useCallback } from "react";
import { Redirect } from "react-router";
import AuthContext from '../context/auth/AuthContext'
import app from "../firebase";
import {storageRef} from "../firebase";
import style from "../style/SignUp.module.css";

const SignUp = ({ history }) => {
  const [signUpState, setSignUpState] = useState({
    name: "",
    email: "",
    password: "",
    image: '',
    url: ''
  });


  const {addUserToDb} = useContext(AuthContext)
  
  const nameSignUp = (e) => {
    setSignUpState({
      ...signUpState,
      [e.target.name]: e.target.value,
    });
  };
  const emailSignUp = (e) => {
    setSignUpState({
      ...signUpState,
      [e.target.name]: e.target.value,
    });
  };

  const passSignUp = (e) => {
    setSignUpState({
      ...signUpState,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = e => {
    if (e.target.files[0]) {
      signUpState.image = e.target.files[0];
      console.log(signUpState.image.name)
    }
  };


  const handleSignUp = useCallback( async (event) => {
      event.preventDefault();
      const email = signUpState.email;
      const password = signUpState.password;
      // image upload
      const uploadTask = storageRef.ref(`images/${signUpState.image.name}`).put(signUpState.image);
      
      try {
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storageRef
              .ref("images")
              .child(signUpState.image.name)
              .getDownloadURL()
              .then(url => {
               let imageURL = url
               addUserToDb({
                displayName: signUpState.name,
                email: signUpState.email,
                photoURL: imageURL,
                followers: 0,
                following: 0,
                usersFollowing: '',
                usersFollowers: '',
               })
              const user = app.auth().currentUser;
                user.updateProfile({
                  photoURL: imageURL
                })
                
              }
              );
          }
        );
        console.log("image: ", signUpState.image)
        await app.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const user = app.auth().currentUser;
          localStorage.setItem('userId', JSON.stringify(user.multiFactor.user.uid));
          return user.updateProfile({
            displayName: signUpState.name,
          })
        })
        history.push("/login");
        console.log("sign up succesfully");
      } catch (error) {
        alert(error);
      }
      
    },
    [signUpState, history, addUserToDb]
    );

  return (
    <div className={style.containerLogIn}>
      <div>
        <h1 className={style.title}>Register now and start Tweeting!</h1>
        <h3 className={style.signUp}>Sign Up</h3>
      </div>
      <form className={style.form} onSubmit={handleSignUp}>
        <input
          type="text"
          value={signUpState.name}
          name="name"
          placeholder="Name"
          onChange={nameSignUp}
          className={style.inputLogIn}
        />
        <input
          type="email"
          value={signUpState.email}
          name="email"
          placeholder="Email"
          onChange={emailSignUp}
          className={style.inputLogIn}
          />
        <input
          type="password"
          value={signUpState.password}
          name="password"
          placeholder="Password"
          onChange={passSignUp}
          className={style.inputLogIn}
          />
         <input
          className={style.inputFile}
          type="file"
          name="image"
          onChange={handleImage}
          />
           <div className={style.buttonForm}>
          <button className={style.button}>Sing Up</button>
          <button className={style.logIn}><a href="/login">You have an account? Log in</a></button>
      </div>  
      </form>
    </div>
  );
};

export default SignUp;
