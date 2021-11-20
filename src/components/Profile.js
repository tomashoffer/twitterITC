import React, { useContext, useEffect, useState } from "react";
import Barra from "./Barra";
import AuthContext from "../context/auth/AuthContext";
import TweetContext from "../context/tweet/TweetContext";
import UserContext from "../context/user/UserContext";
import style from "../style/Profile.module.css";
import ListTweet from "./ListTweet";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { db } from "../firebase";
import { arrayUnion, arrayRemove } from "firebase/firestore";

const Profile = (props) => {
  const { currentUser, setGeneralTweets, loggedUser } = useContext(AuthContext);
  const { otherUser, getOtherUserTweets, getLikesTweets, setSeeLikes, seeLikes } = useContext(TweetContext);
  const { user, getUserProfile, actualUserDoc } = useContext(UserContext);
  const [isOtherUser, setIsOtherUser] = useState();
  const [getUser, setGetUser] = useState([]);
  const [userLogged, setUserLogged] = useState([]);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    setGeneralTweets(false);
    setIsOtherUser(otherUser);
    setCurrentId(JSON.parse(localStorage.getItem("userId")));
    if (user) {
      setGetUser(user);
    }
    if (loggedUser) {
      setUserLogged(loggedUser);
    }
    // if (props.match.params.id) {
    //   setIsOtherUser(true);
    //   getUserProfile(props.match.params.id);
    //   getOtherUserTweets(props.match.params.id);
    // }
    // eslint-disable-next-line
  }, [
    setGeneralTweets,
    setIsOtherUser,
    otherUser,
    user,
    getUser,
    getOtherUserTweets,
    getUserProfile,
  ]);

  const followUser = (user) => {
    let followers = user.usersFollowers.length + 1;
    // update user profile
    db.collection("users")
      .doc(user.docId)
      .update({
        usersFollowers: arrayUnion(currentId),
        followers: followers,
      });
    // update current user
        if (actualUserDoc) {
          console.log(actualUserDoc);
          let following = actualUserDoc.usersFollowing.length + 1;
          db.collection("users")
            .doc(actualUserDoc.docId)
            .update({
              usersFollowing: arrayUnion(user.authId),
              following: following,
            });
        }
  };

  const unfollowUser = (user) => {
    // update user profile
    let followers = user.usersFollowers.length - 1;
    db.collection("users")
      .doc(user.docId)
      .update({
        usersFollowers: arrayRemove(currentId),
        followers: followers,
      });
    // update current user
        if (actualUserDoc) {
          console.log(actualUserDoc);
          let following = actualUserDoc.usersFollowing.length - 1;
          db.collection("users")
            .doc(actualUserDoc.docId)
            .update({
              usersFollowing: arrayRemove(user.authId),
              following: following,
            });
        }
  };

  const myLikes = (authId) => {
    getLikesTweets(authId)
    if(seeLikes){
      setSeeLikes(false)
    }else{
      setSeeLikes(true)
    }
  }



  return (
    <div>
      <Barra />
      {isOtherUser ? (
        <div>
          {getUser.map((user) => {
            return (
              <div className={style.profile}>
                <Card
                  style={{ backgroundColor: "#343A40" }}
                  className={style.card}
                >
                  <CardContent className={style.cardContent}>
                    <div className={style.divImg}>
                      <img
                        src={user.photoURL}
                        alt="profileImg"
                        className={style.profileImg}
                      />
                    </div>
                    <div className={style.nameinfo}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        style={{ color: "#fff" }}
                      >
                        {user.displayName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ color: "#fff" }}
                      >
                        <div className={style.followData}>
                          <div>
                            <Button size="small">Following</Button>
                            <h4>{user.following}</h4>
                          </div>
                          <div>
                            <Button size="small">Followers</Button>
                            <h4>{user.followers}</h4>
                          </div>
                        </div>
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    
                    {!seeLikes ? (
                      <Button 
                      onClick={() => myLikes(user.authId)} 
                      variant="contained" 
                      size="small">
                      Likes
                    </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => myLikes(user.authId)}
                      >
                       Tweets
                      </Button>
                    )}
                    {user.usersFollowers.includes(currentId) ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => unfollowUser(user)}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => followUser(user)}
                      >
                        Follow
                      </Button>
                    )}
                  </CardActions>
                </Card>
                <div className={style.tweetsList}>
                  <ListTweet />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {userLogged.map((user) => {
            return (
              <div className={style.profile}>
                <Card
                  style={{ backgroundColor: "#343A40" }}
                  className={style.card}
                >
                  <CardContent className={style.cardContent}>
                    <div className={style.divImg}>
                      <img
                        src={user.photoURL}
                        alt="profileImg"
                        className={style.profileImg}
                      />
                    </div>
                    <div className={style.nameinfo}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        style={{ color: "#fff" }}
                      >
                        {user.displayName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ color: "#fff" }}
                      >
                        <div className={style.followData}>
                          <div>
                            <Button size="small">Following</Button>
                            <h4>{user.following}</h4>
                          </div>
                          <div>
                            <Button size="small">Followers</Button>
                            <h4>{user.followers}</h4>
                          </div>
                        </div>
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                  {!seeLikes ? (
                      <Button  
                      onClick={() => myLikes(user.authId)} 
                      variant="contained" 
                      size="small">
                      Likes
                    </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => myLikes(user.authId)}
                      >
                       Tweets
                      </Button>
                    )}
                  </CardActions>
                </Card>
                <div className={style.tweetsList}>
                  <ListTweet />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
