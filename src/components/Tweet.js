import React from 'react'
import style from '../style/Tweet.module.css'

  const Tweet = () => {
    const tweet = [
      {name: 'Tomas', date: '10/12/21', text: 'Este es el tw nro 1'},
      {name: 'Leo', date: '10/12/21', text: 'Este es el tw nro 2'},
      {name: 'Kevin', date: '10/12/21', text: 'Este es el tw nro 3'},
      {name: 'Eric', date: '10/12/21', text: 'Este es el tw nro 4'},
    ]

      return ( 
          <div className={style.tweetContainer}>
              <div>
                <p>${tweet.name}</p>
                <p>date</p>
              </div>
              <div>
                  text
              </div>
          </div>
       );
  }
   
  export default Tweet;