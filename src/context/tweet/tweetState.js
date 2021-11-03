import React, {useReducer, useState} from 'react'
import TweetContext from './tweetContext'
import TweetReducer from './tweetReducer'
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

       // Obtener todos los proyectos
       const getTweets = () => {
        try {
            const resultado = JSON.parse(localStorage.getItem('tweets'))
            console.log('resultado', resultado)
            return resultado;
        //   dispatch({
        //       type: GET_TWEET, 
        //       payload: resultado
        //   })
        } catch (error) {
          console.log(error)
        }
      }
      getTweets()
       
      // Agregar proyecto
    const addTweet =  tweet => {
        try {
        //  dispatch({
        //      type: ADD_TWEET, 
        //      payload: tweet
        //  })
        console.log(tweet)
        const newTweets = [tweet, ...tweets]
        setTweets(newTweets)
        localStorage.setItem('tweets', JSON.stringify(newTweets))
        } catch (error) {
            console.log(error)
        }
     }
        return(
            <TweetContext.Provider
                value={{
                    tweets,
                    getTweets,
                    addTweet
                }}
            >
                {props.children}
            </TweetContext.Provider>
        )
    
    }
    
    export default TweetState
    
    