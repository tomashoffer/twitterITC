import React, { useState, useEffect, useContext } from "react";
import Barra from "./Barra";
import ListTweet from "./ListTweet";
import style from "../style/FormTweet.module.css";
import TextareaAutosize from "react-textarea-autosize";
import AuthContext from "../context/auth/AuthContext";
import AlertasContext from "../context/alert/AlertContext";
import TweetContext from "../context/tweet/TweetContext";
import SpinnerContext from "../context/spinner/SpinnerContext";
import Spinner from "./Spinner/Spinner";
import {Timestamp} from 'firebase/firestore'


const FormTweet = () => {

  const [tweet, setTweet] = useState({
    userName: "",
    content: "",
    date: {},
    userId: "",
  });
  const [searchResults, setSearchResults] = useState([])
  const [getSearchTerm, setGetSearchTerm] = useState('')
  // Context
  const { alert, showAlert } = useContext(AlertasContext);
  const { addTweetToDB, getUserTweets } = useContext(TweetContext);
  const { showSpinner, spinner } = useContext(SpinnerContext);
  const { currentUser, getLoggedUserProfile } = useContext(AuthContext);

  const getTweet = (e) => {
    setTweet({
      ...tweet,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (tweet.content.length === 140) {
      showAlert("The tweet can not contain more than 140 chars");
    }
    // eslint-disable-next-line
  }, [tweet.content.length]);

  const onSubmit = (e) => {
    e.preventDefault();
    // validar que no haya campos vacios
    if (tweet.content.trim() === "") {
      showAlert("You should write something to send a tweet");
      return;
    }

    // Spinner
    showSpinner();

    addTweetToDB({
      userName: currentUser._delegate.displayName,
      content: tweet.content,
      date: Timestamp.now(),
      userId: currentUser._delegate.uid,
      profileImg: currentUser._delegate.photoURL,
      userLike: [],
      like: 0,
    });

    setTweet({
      content: "",
    });
    getUserTweets()
  };

  return (
    <div>
     <Barra setSearchResults={setSearchResults} getSearchTerm={getSearchTerm} setGetSearchTerm={setGetSearchTerm}/>
        <div className={style.addTweet}>
                <form onSubmit={onSubmit} className={style.addTweetForm}>
                <TextareaAutosize
                    type="text"
                    maxLength={140}
                    placeholder="What you have in mind..."
                    className={style.newTweetTextArea}
                    value={tweet.content}
                    onChange={getTweet}
                    name="content"
                  />
                    <div className={style.submitButton}>
                    <button className={style.addTweetSubmit}>Tweet</button>    
                    </div>
                </form>
          </div>
                <div>
              {alert ? <div className={style.alertStyle}>{alert}</div> : null}
              {spinner ? (
                <div className={style.spinner}>
                  <Spinner />
                </div>
              ) : null}
            </div>
          <ListTweet searchResults={searchResults} getSearchTerm={getSearchTerm}/>
      </div>
  );
};

export default FormTweet;


