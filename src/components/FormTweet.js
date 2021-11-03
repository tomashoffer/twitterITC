import React, {useState, useEffect, useContext} from 'react'
import style from '../style/FormTweet.module.css'
import TextareaAutosize from 'react-textarea-autosize';
import { v4 as uuidv4 } from 'uuid';
import AlertasContext from '../context/alert/AlertContext'
import TweetContext from '../context/tweet/tweetContext'
import moment from 'moment';

const FormTweet = () => {
    const [tweet, setTweet] = useState({
        user: '',
        userId: '',
        date: '',
        text: ''
    })

    // extraer valores de context
    const alertaContext = useContext(AlertasContext);
    const { alert, showAlert } = alertaContext;
    const tweetContext = useContext(TweetContext);
    const { addTweet } = tweetContext;

    const getTweet = e =>{
        setTweet({
            ...tweet,
            [e.target.name] : e.target.value
        })
    }

    useEffect(() => {
        if(tweet.text.length === 140 ){
            showAlert('The tweet can not contain more than 140 chars')
             return;
        }
        // eslint-disable-next-line
    }, [tweet.text.length, showAlert])

    const onSubmit = e => {
        e.preventDefault()
        // validar que no haya campos vacios
        if(tweet.text.trim() === '' ){
            showAlert('You should write something to send a tweet')
             return;
         }
        // pasarlo al action
        addTweet({
            name: 'Tomas',
            userId: uuidv4(),
            date: moment().calendar(),
            text: tweet.text
        })
    }
   
    return ( 
        <div className={style.form}>
            <form onSubmit={onSubmit}>
               <div className="form_box">
                   <TextareaAutosize  
                   maxLength="140"
                   type="text" 
                   placeholder="What you have in mind..."
                   className={style.form_input}
                   value={tweet.text}
                   onChange={getTweet}
                    name="text"
                    />
                   <button
                   className={style.form_button}
                   >Tweet
                   </button>
                   { alert ? (<div style={{color: 'red'}}>{alert}</div>) : null}
               </div>
            </form>
        </div>
     );
}
 
export default FormTweet;