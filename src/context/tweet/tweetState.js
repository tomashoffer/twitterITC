import React, { useState, useEffect, useContext } from "react";
import TweetContext from "./TweetContext";
import AuthContext from '../auth/AuthContext'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const TweetState = (props) => {
  // states
  const [tweets, setTweets] = useState([]);
  const [getAllTw, setGetAllTw] = useState([]);
  const [userTweets, setUserTweets] = useState([]);
  const [last, setLast] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [otherUser, setOtherUser] = useState(false);
  const [otherUserTweets, setOtherUserTweets] = useState([]);
  const [likeTweets, setLikeTweets] = useState([]);
  const [seeLikes, setSeeLikes] = useState(false);
  // context
  const { currentUser } = useContext(AuthContext);


  // Add tweet to Firebase
  const addTweetToDB = async (tweet) => {
    try {
      const docRef = await addDoc(collection(db, "tweets"), tweet);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getAllTweets = async () => {
    let allTweets = db.collection("tweets").orderBy("date", "desc")
    allTweets.onSnapshot((querySnapshot) => {
      const tweetsArr = [];
      querySnapshot.forEach((doc) => {
        tweetsArr.push({ ...doc.data(), id: doc.id });
      });
      setGetAllTw(tweetsArr);
    });
  };

  // Get first 10 tweets from Firebase
  const getTweetsFromDB = async () => {
    let firstTen = db.collection("tweets").orderBy("date", "desc").limit(10);
    firstTen.onSnapshot((querySnapshot) => {
      let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLast(lastVisible);
      const tweetsArr = [];
      querySnapshot.forEach((doc) => {
        tweetsArr.push({ ...doc.data(), id: doc.id });
      });
      setTweets(tweetsArr);
    });
  };

  // Get the next tweets for paginator
  const fetchMoreData = async () => {
    let next = db
      .collection("tweets")
      .orderBy("date", "desc")
      .startAfter(last)
      .limit(10);
    next.get().then(function (querySnapshot) {
      let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLast(lastVisible);
      const tweetsArr = [];

      querySnapshot.forEach(function (doc) {
        tweetsArr.push({ ...doc.data(), id: doc.id });
      });
      if (lastVisible !== undefined) {
        setTimeout(function () {
          const updated_list = tweets.concat(tweetsArr);
          setTweets(updated_list);
        }, 1500);
      } else {
        setHasMore(false);
        return;
      }
    });
  };

// Get only user's tweets
  const getUserTweets = async () => {
    if(currentUser){
      const userOnly =  await db.collection("tweets").where("userId", "==", currentUser._delegate.uid)
      userOnly.get()
      .then(function(querySnapshot) {
        const userTweets = []
          querySnapshot.forEach(function(doc) {
              userTweets.push({ ...doc.data(), id: doc.id });
              setUserTweets(userTweets)
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      }
    };

// tweets only of other user
  const getOtherUserTweets = async (authId) => {
    if(currentUser){
      const getTweets =  await db.collection("tweets").where("userId", "==", authId)
      getTweets.get()
      .then(function(querySnapshot) {
        const userTweets = []
          querySnapshot.forEach(function(doc) {
              userTweets.push({ ...doc.data(), id: doc.id });
              setOtherUserTweets(userTweets)
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      }
    };

// // tweets only of other user
  const getLikesTweets = async (userId) => {
    if(currentUser){
      // const getTweets =  await db.collection("tweets").where("userLike", "array-contains", userId)
      const getTweets =  query(collection(db, "tweets"), where("userLike", "array-contains", userId))
      const querySnapshot = await getDocs(getTweets);
      const likes = []
      querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data());
          const like = doc.data()
          likes.push(like)
          setLikeTweets(likes)
      });
  
      }
    };



  
    
    useEffect(() => {
      getTweetsFromDB()
      getUserTweets()
      getAllTweets()
      
    // eslint-disable-next-line
  }, [currentUser]);
    


  return (
    <TweetContext.Provider
      value={{
        tweets,
        hasMore,
        userTweets,
        getAllTw,
        setOtherUser,
        otherUserTweets,
        otherUser,
        getOtherUserTweets,
        addTweetToDB,
        getTweetsFromDB,
        fetchMoreData,
        getUserTweets,
        getLikesTweets,
        likeTweets,
        setLikeTweets,
        setSeeLikes,
        seeLikes
      }}
    >
      {props.children} 
    </TweetContext.Provider>
  );
};

export default TweetState;
