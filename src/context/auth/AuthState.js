import React, {useState, useEffect} from 'react';
import AuthContext from './AuthContext'
import app from '../../firebase';
import { db } from "../../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const AuthState = props => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);
    const [generalTweets, setGeneralTweets] = useState(true)

    const [loggedUser, setLoggedUser] = useState();

    useEffect(() => {
        app.auth().onAuthStateChanged((user) => {
          setCurrentUser(user)
          setPending(false)
        });
      }, []);
    
      if(pending){
        return <>Loading...</>
      }

      
  // Add user to Firebase
  const addUserToDb = async (user) => {
    try {
      user.authId = await JSON.parse(localStorage.getItem('userId'))
      const docRef = await addDoc(collection(db, "users"), user);
      db
      .collection("users")
      .doc(docRef.id)
      .update({
        docId: docRef.id
      });   
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

// save google user
const addGoogleUserToDb = async (user) => {
  db.collection('users')
  .get()
  .then(querySnapshot => {
    const documents = querySnapshot.docs.map(doc => doc.data())
    const result = documents.find( (userToFind) => userToFind.email === user.email );
    console.log(result)
    if(!result){
      let uuid = uuidv4()
      user.authId = JSON.parse(localStorage.getItem('userId'))
      setDoc(doc(db, "users", uuid), user);
      db
      .collection("users")
      .doc(uuid)
      .update({
        docId: uuid
      });   

    }else{
      console.log('user found')
    }
   
  })

};

const getLoggedUserProfile =  async (id) => {
  const userSelected = await db.collection("users").where("authId", "==", id)
  userSelected.get()
  .then(function(querySnapshot) {
    const user = []
      querySnapshot.forEach(function(doc) {
          user.push({ ...doc.data(), id: doc.id });
          setLoggedUser(user)
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
}




    return(
        <AuthContext.Provider
        value={{
            currentUser,
            generalTweets,
            loggedUser,
            setGeneralTweets,
            addUserToDb,
            addGoogleUserToDb,
            getLoggedUserProfile,
            setLoggedUser
        }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthState











