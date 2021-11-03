import React, {useState} from 'react'
import style from '../style/Profile.module.css'

const Profile = () => {

    const [user, setUser] = useState({
        name: '',
        userId: ''
    })

    const getUser = e =>{
        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = e => {
        e.preventDefault()
        // validar que no haya campos vacios
        if(user.name.trim() === '' ){
           
             return;
         }
      

        // pasarlo al action
        // registrarUsuario({
        //     nombre,
        //     email,
        //     password
        // })
    }

    return ( 
        <div>
            <h1>Profile</h1>
            <form onSubmit={onSubmit}>
            <label htmlFor="">User Name</label>
            <input type="text"
             className={style.user_input}
             value={user.name}
             onChange={getUser}

              name="text" />
            </form>
        </div>
     );
}
 
export default Profile;