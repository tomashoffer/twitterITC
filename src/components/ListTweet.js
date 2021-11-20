import React, {useContext} from 'react'
import style from '../style/ListTweet.module.css'
import SpinnerContext from '../context/spinner/SpinnerContext'
import Tweet from './Tweet'

const ListTweet = ({searchResults, getSearchTerm}) => {

  const spinnerContext = useContext(SpinnerContext);
  const { spinner } = spinnerContext;
  
    return ( 

        <div className={style.tweet}>
            {spinner ? null : <Tweet searchResults={searchResults} getSearchTerm={getSearchTerm}/>}
        </div>
     );
}
 
export default ListTweet;