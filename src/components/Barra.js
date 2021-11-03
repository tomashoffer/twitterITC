import React from 'react'
import style from '../style/Barra.module.css'
import {Link} from "react-router-dom";
const Barra = () => {
    return ( 
        <div >
            <nav className={style.barra}>
                <ul className={style.ul}>
                    <li className={style.list} id={style.linkMargin}>
                        <Link className={style.link} to="/">Home</Link>
                    </li>
                    <li className={style.list}>
                        <Link className={style.link} to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </div>
     );
}
 
export default Barra;
