import React, {useContext, useState, useEffect} from 'react'
import Tweet from './Tweet'
import style from '../style/ListTweet.module.css'
import TweetContext from '../context/tweet/tweetContext'

const ListTweet = () => {
  const tweetContext = useContext(TweetContext);
  const { getTweets } = tweetContext;
  let alltw = getTweets();


  useEffect(() => {
    if(!alltw){
      alltw = []
    }
  }, [alltw])

  console.log('aaaassaa', alltw);
  // const titulo = alltw.length === 0 ? 'There are no tweets' : null;

    return ( 
        <div className={style.tweet}>
          {!alltw ? null : alltw.map((tweet) => (
               <div key={tweet.name} className={style.tweetContainer}>
               <div className={style.dataTweet}>
                 <div>{tweet.name}</div>
                 <div>{tweet.date}</div>
               </div>
               <div className={style.textTweet}>
                  <p>{tweet.text}</p>
               </div>
           </div>
          ))}
        </div>
     );
}
 
export default ListTweet;