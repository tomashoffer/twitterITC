import React, {useContext, useEffect, useState} from 'react'
import style from '../style/ListTweet.module.css'
import TweetContext from '../context/tweet/tweetContext'

const ListTweet = () => {
  const tweetContext = useContext(TweetContext);
  const { tweets } = tweetContext;
  const [allTweets, SetAllTweets] = useState(tweets)

  useEffect(() => {
    SetAllTweets(tweets)
  }, [tweets])
  // const titulo = alltw.length === 0 ? 'There are no tweets' : null;

    return ( 
        <div className={style.tweet}>
          { allTweets.map((tweet) => (
               <div key={tweet.id} className={style.tweetContainer}>
               <div className={style.dataTweet}>
                 <div>{tweet.userName}</div>
                 <div>{tweet.date}</div>
               </div>
               <div className={style.textTweet}>
                  <p>{tweet.content}</p>
               </div>
           </div>
          ))}
        </div>
     );
}
 
export default ListTweet;