import React, {useContext, useState, useEffect, useRef} from 'react'
import app from '../firebase';
import AuthContext from '../context/auth/AuthContext'
import TweetContext from '../context/tweet/TweetContext'
import UserContext from '../context/user/UserContext'
import style from '../style/Barra.module.css'
import {Link, Redirect} from "react-router-dom";


const Barra = ({setSearchResults, setGetSearchTerm, getSearchTerm}) => {
    const { currentUser, setGeneralTweets, getLoggedUserProfile, setLoggedUser } = useContext(AuthContext);
    const { tweets, getAllTw, setOtherUser, getUserTweets, setLikeTweets, setSeeLikes } = useContext(TweetContext);
    const { setUser } = useContext(UserContext);
    const [searchUser, setSearchUser] = useState(true)
    const [searchBar, setSearchBar] = useState('user')

    const [allTweets, setAllTweets] = useState([])
    const [userId, setUserId] = useState('')
    const [homeBtn, setHomeBtn] = useState(false)
    const [profileBtn, setProfileBtn] = useState(true)
    const searchBarElement = useRef('')

    useEffect(() => {
        if(searchBar === "tweets"){
            setSearchUser(false)
        }else{
            setSearchUser(true)
        }
        if(getAllTw){
            setAllTweets(getAllTw)
          }
        if(currentUser){
            setUserId(currentUser._delegate.uid)
        }
    }, [searchBar, searchUser, getAllTw, allTweets, currentUser])



    const logOut = e => {
        app.auth().signOut();
        localStorage.removeItem('userId')
        localStorage.removeItem('userSelected')
        return <Redirect to="/" />;
    }
    
    const handleSelect = e => {
        setSearchBar(e.target.value)
    }
    const homeClick = e => {
        setGeneralTweets(true)
        setOtherUser(false)
        setUser([])
        setHomeBtn(false)
        setProfileBtn(true)
        setLoggedUser([])
        setLikeTweets([])
        setSeeLikes(false)
    }
    
    const profileClick = e => {
        setGeneralTweets(false)
        setOtherUser(false)
        getUserTweets()
        getLoggedUserProfile(userId)
        setHomeBtn(true)
        setProfileBtn(false)
    }

    const searchTerm = e => {
        setGetSearchTerm(searchBarElement.current.value);
        if(searchUser){
            searchByUser(getSearchTerm.toUpperCase())
        }else{
            searchByTweet(getSearchTerm.toUpperCase())
        }
        if(getSearchTerm === ''){
            setSearchResults(tweets)
        }
    }

    const searchByUser = searchTerm => {
        try {
            let newArr = []
            for(let i = 0; i < allTweets.length; i++){
              const regExp = `^${searchTerm}`;
              const searchTermReg= new RegExp(regExp, 'g');  
              newArr = allTweets.filter(elem => searchTermReg.test(elem.userName.toUpperCase()));
            }
            setSearchResults(newArr)
          } catch (e) {
              console.error(e)
          }
    }
    const searchByTweet = searchTerm => {
            if(searchTerm !== ""){
                let newArr = []
                for(let i = 0; i < allTweets.length; i++){
                  const regExp = `^${searchTerm}`;
                  const searchTermReg= new RegExp(regExp, 'g');  
                  newArr = allTweets.filter(elem => searchTermReg.test(elem.content.toUpperCase()));
                }
            setSearchResults(newArr)         
          } 
    }

    return ( 
        <div className={style.contenedor}>
            <nav className={style.barra}>
                <ul className={style.ul}>
                    <div className={style.links}>
                    <li className={style.list} id={style.linkMargin}>
                        <Link to="/" disabled={homeBtn} onClick={e => homeClick()}><p className={style.link}>Home</p></Link>
                    </li>
                    <li className={style.list}>
                        <Link to="/profile" disabled={profileBtn} onClick={profileClick}><p className={style.link}>Profile</p></Link>
                    </li>
                    <li className={style.list}>
                      <input type="text" 
                      ref={searchBarElement}
                      className={style.searchBar} 
                      placeholder="Search user or tweet"
                      value={getSearchTerm}
                      onChange={searchTerm}
                      />
                      <select value={searchBar} name='searchBar' onChange={handleSelect}  className={style.select} >
                          <option value="user">user</option>
                          <option value="tweets">tweets</option>
                      </select>
                    </li>
                    </div>
                 <div className={style.links}>
                 <li className={style.list} id={style.name}>
                        <p className={style.link}>Hello, {currentUser._delegate.displayName}!</p>
                    </li> 
                  
                    <li className={style.list}>
                        <p className={style.link} id={style.logOut} onClick={logOut}>Log Out</p>
                    </li>
                 </div>
                    
                </ul>
            </nav>
        </div>
     );
}
 
export default Barra;
