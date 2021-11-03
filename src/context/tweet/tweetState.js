import React, {useReducer, useState, useEffect} from 'react'
import TweetContext from './tweetContext'
import TweetReducer from './tweetReducer'
import axios from "axios";
import {GET_TWEET,
        ADD_TWEET,
        DELETE_TWEET,
        EDIT_TWEET,
        ACTUAL_TWEET
    } from '../../types/types'

    const TweetState = props => {
        
        const [tweets, setTweets] = useState([])
        // crear dispatch y state
        const [state, dispatch] = useReducer(TweetReducer, tweets);
        // FUNCIONES

        useEffect(() => {
            const getAllTweets = async () => {
                const url = `https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet`;
                const resultado = await axios(url);
                setTweets(resultado.data.tweets);
                console.log(resultado.data.tweets)
                }
                getAllTweets();
                console.log('All tw', tweets)
                // eslint-disable-next-line
        }, [setTweets]);
    
       
      // Add tweet
    const addTweet = async (tweet) => {
        try {
         await axios.post(`https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet`, tweet)
          const newTweet = [tweet, ...tweets]
          setTweets(newTweet)
        //  dispatch({
        //      type: ADD_TWEET, 
        //      payload: tweet
        //  })
        } catch (error) {
            console.log(error)
        }
     }

        return(
            <TweetContext.Provider
                value={{
                    tweets,
                    addTweet
                }}
            >
                {props.children}
            </TweetContext.Provider>
        )
    
    }
    
    export default TweetState
    
    