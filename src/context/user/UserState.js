import React, { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import AuthContext from '../auth/AuthContext'
// import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UserState = (props) => {
  // states
  const [user, setUser] = useState([]);
  const [actualUserDoc, setActualUserDoc] = useState([]);

  // context
  const { currentUser } = useContext(AuthContext);  
    
    useEffect(() => {
      getActualUser()
    // eslint-disable-next-line
  }, [currentUser]);
    
  const getUserProfile =  async (id) => {
    const userSelected = await db.collection("users").where("authId", "==", id)
    userSelected.get()
    .then(function(querySnapshot) {
      const user = []
        querySnapshot.forEach(function(doc) {
            user.push({ ...doc.data(), id: doc.id });
            setUser(user)
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
  }

const getActualUser = () => {
  db.collection("users")
  .get()
  .then((querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => doc.data());
    if(currentUser){
      const result = documents.find(
        (userToFind) => userToFind.authId === currentUser._delegate.uid
      );
      setActualUserDoc(result)
    }
})
}


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUserProfile,
        actualUserDoc
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
