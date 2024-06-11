import styles from './NavBar.module.css'
import { Link } from "react-router-dom";

import img from '../BGTeddy.png'
import { postApi } from '../../APIHandler/apiHandler';
import { useEffect, useState } from 'react';
import { checkLogin } from '../../APIHandler/checkLogin';

export default function Bar(params) {
    const[isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(()=>{
        checkLogin(setIsUserLoggedIn);
    }, [])

    return (
        <nav className={styles.NavigationBar}>
            <h4 className={styles.Logo}>OpenCourse</h4>
            <Link to='/'>Home</Link>
            <Link to='/CoursePage'>Courses</Link>
            <Link to='/About'>About</Link>
            <Link to='/Contact'>Contact</Link>
            {
                isUserLoggedIn ?
                <Link to='/user/vehdat'><img className={styles.PFP} src={img} /></Link>
                :
                <Link to='/login'>Login</Link>
                
            }
        </nav>
    )
}