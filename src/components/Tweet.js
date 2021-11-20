import React, { useContext, useEffect, useState } from "react";
import style from "../style/Tweet.module.css";
import TweetContext from "../context/tweet/TweetContext";
import AuthContext from "../context/auth/AuthContext";
import UserContext from "../context/user/UserContext";
import Spinner from "./Spinner/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { db } from "../firebase";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import {Link} from "react-router-dom";

const Tweet = ({ searchResults, getSearchTerm }) => {
  // context
  const {
    tweets,
    fetchMoreData,
    hasMore,
    userTweets,
    setOtherUser,
    otherUser,
    getOtherUserTweets,
    otherUserTweets,
    getUserTweets,
    likeTweets,
    seeLikes
  } = useContext(TweetContext);
  const { currentUser, generalTweets } = useContext(AuthContext);
  const { getUserProfile } = useContext(UserContext);
  // states
  const [renderTweets, setRenderTweets] = useState([]);
  const [onlyUser, setOnlyUser] = useState([]);
  const [currentId, setcurrentId] = useState('');

  useEffect(() => {
    setcurrentId(currentUser._delegate.uid)
    if (generalTweets && getSearchTerm) {
      setRenderTweets(searchResults);
    }
    if (generalTweets && tweets && !otherUser && !getSearchTerm) {
      setRenderTweets(tweets);
    }
    if (userTweets && !otherUser) {
      setOnlyUser(userTweets);
    }
    if(otherUser){
      setOnlyUser(otherUserTweets)
    }
    if(seeLikes){
      setOnlyUser(likeTweets)
      setRenderTweets(likeTweets)
    }
  }, [
    tweets,
    renderTweets,
    userTweets,
    onlyUser,
    searchResults,
    getSearchTerm,
    generalTweets,
    otherUser,
    setOtherUser,
    otherUserTweets,
    currentUser._delegate.uid,
    likeTweets,
    seeLikes
  ]);

  const unLike = async (tweet) => {
    console.log(tweet);
    let likes = tweet.userLike.length - 1;
    await db
      .collection("tweets")
      .doc(tweet.id)
      .update({
        userLike: arrayRemove(currentId),
        like: likes,
      });
      getUserTweets()
      getOtherUserTweets(tweet.userId)
  };

  const giveLike = async (tweet) => {
    console.log(tweet);
    let likes = tweet.userLike.length + 1;
    await db
      .collection("tweets")
      .doc(tweet.id)
      .update({
        userLike: arrayUnion(currentId),
        like: likes,
      });   
      getUserTweets()
      getOtherUserTweets(tweet.userId)
  };

  const otherUserProfile = userId => {
    if(userId === currentId){
       setOtherUser(false);
     }else{
      setOtherUser(true);
     }
     getOtherUserTweets(userId);
     getUserProfile(userId)

  };
  
  return (
    <div>
      {generalTweets ? (
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={renderTweets.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Spinner />}
          endMessage={
            <p style={{ textAlign: "center", color: "white", padding: "10px" }}>
              <b>Nothing here! Create more Tweets ...</b>
            </p>
          }
        >
          {renderTweets.map((tweet) => (
            <div className={style.tweetWrap} key={tweet.id}>
              <div className={style.tweetHeader}>
                <img src={tweet.profileImg} alt="" className={style.avator} />
                <div className={style.tweetHeaderInfo}>
                  <Link to={`/profile/${tweet.userId}`} onClick={() => otherUserProfile(tweet.userId)} style={{ color: "#fff" }}>{tweet.userName}</Link>
                  <span></span>
                  <span>
                    .{" "}
                    {new Date(tweet.date.seconds * 1000)
                      .toUTCString()
                      .slice(0, -3)}
                  </span>
                  <div className={style.tweetContent}>
                    <p>{tweet.content}</p>
                  </div>
                </div>
              </div>
              <div className={style.tweetInfoCounts}>
                <div className={style.comments}>
                  <svg
                    className="feather feather-message-circle sc-dnqmqq jxshSx"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <div
                    className="comment-count"
                    style={{ color: "#fff", margin: "0 0 24 24" }}
                  >
                    33
                  </div>
                </div>

                <div className="retweets">
                  <svg
                    className="feather feather-repeat sc-dnqmqq jxshSx"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                  <div className="retweet-count" style={{ color: "#fff" }}>
                    397
                  </div>
                </div>

                <div className="likes">
                  {tweet.userLike.includes(currentUser._delegate.uid) ? (
                    <img
                      onClick={() => unLike(tweet)}
                      src="https://img.icons8.com/color/100/000000/like--v3.png"
                      alt="like"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "10px",
                      }}
                    />
                  ) : (
                    <svg
                      onClick={() => giveLike(tweet)}
                      className="feather feather-heart sc-dnqmqq jxshSx"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}

                  <div className="likes-count" style={{ color: "#fff" }}>
                    {tweet.like}
                  </div>
                </div>

                <div className="message">
                  <svg
                    className="feather feather-send sc-dnqmqq jxshSx"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        onlyUser.map((tweet) => (
          <div className={style.tweetWrap} key={tweet.id}>
            <div className={style.tweetHeader}>
              <img src={tweet.profileImg} alt="" className={style.avator} />
              <div className={style.tweetHeaderInfo}>
                <Link to="/profile" onClick={() => otherUserProfile(tweet.userId)} style={{ color: "#fff" }}>{tweet.userName}</Link>
                <span></span>
                <span>
                  .{" "}
                  {new Date(tweet.date.seconds * 1000)
                    .toUTCString()
                    .slice(0, -3)}
                </span>
                <div className={style.tweetContent}>
                  <p>{tweet.content}</p>
                </div>
              </div>
            </div>
            <div className={style.tweetInfoCounts}>
              <div className={style.comments}>
                <svg
                  className="feather feather-message-circle sc-dnqmqq jxshSx"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <div className="comment-count" style={{ color: "#fff" }}>
                  33
                </div>
              </div>

              <div className="retweets">
                <svg
                  className="feather feather-repeat sc-dnqmqq jxshSx"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
                <div className="retweet-count" style={{ color: "#fff" }}>
                  397
                </div>
              </div>

              <div className="likes">
                  {tweet.userLike.includes(currentUser._delegate.uid) ? (
                    <img
                      onClick={() => unLike(tweet)}
                      src="https://img.icons8.com/color/100/000000/like--v3.png"
                      alt="like"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "10px",
                      }}
                    />
                  ) : (
                    <svg
                      onClick={() => giveLike(tweet)}
                      className="feather feather-heart sc-dnqmqq jxshSx"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}

                  <div className="likes-count" style={{ color: "#fff" }}>
                    {tweet.like}
                  </div>
                </div>

              <div className="message">
                <svg
                  className="feather feather-send sc-dnqmqq jxshSx"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tweet;
