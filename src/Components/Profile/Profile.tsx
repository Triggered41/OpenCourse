import styles from './Profile.module.css';
import buttonStyles from '../Button/ButtonStyles.module.css';

import popupStyles from '../Popup/popup.module.css'

import img from '../BGTeddy.png';
import addImg from '../Course/AddImg.png'
import Bar from '../NavBar/NavBar';
import { Card } from '../Card/Card';
import { useEffect, useState } from 'react';
import { postApi } from '../../APIHandler/apiHandler.tsx';
import Footer from '../Footer.tsx';
import { checkLogin } from '../../APIHandler/checkLogin.tsx';
import { useNavigate, useParams } from 'react-router-dom';
// import { onFieldChange } from '../InputField/inputFieldAnim';
import { InputField } from '../InputField/InputField';
import { PopupCard } from '../Popup/Popup';


export function Profile() {
    const[name, setName] = useState('My Name')
    const[userName, setUserName] = useState('@My User Name')
    const[email, setEmail] = useState('My Email')
    const[courses, setCourses] = useState([])
    const[popup, setPopup] = useState(false);
    const[isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const[isCurrentUser, setIsCurrentUser] = useState(false);

    const[courseName, setCourseName] = useState('');
    const[intro, setIntro] = useState('')

    const nav = useNavigate()
    const { Profile } = useParams()

    useEffect(()=>{
        const un = window.location.pathname
        checkLogin(setIsUserLoggedIn, Profile, setIsCurrentUser)
        postApi(un, {UserName: un})
        .then(res=>res.json())
        .then(user=>{
            setUserName('@'+un.split('/')[2])
            setName(user.Name)
            setEmail(user.Email)
            setCourses(user.Courses)
        })
        
    }, [])


    const onAddCardClick = () => {
        setPopup(true);
    }

    const CreateCourse = () => {
        postApi('CreateCourse', {CourseName: courseName, Intro: intro})
        .then(res=>res.json())
        .then(data=>{
            alert(data);
            nav(0)
        })
        .catch(err=>{throw (err)})
    }

    return (
        <div>
            <Bar />
            <h1 className={styles.Title}>About Me</h1>
            <div className={styles.Profile}>
                <div className={styles.PicHolder}><img className={styles.Picture} src={img} alt="" /></div>
                <div className={styles.Details}>
                    <label className={styles.Field} htmlFor="">Name</label>
                    <input className={styles.Field} type="text" defaultValue={"name"} value={name}/>
                    <label className={styles.Field} htmlFor="">User Name</label>
                    <input className={styles.Field} type="text" defaultValue={"userName"} value={userName}/>
                    <label className={styles.Field} htmlFor="">Email</label>
                    <input className={styles.Field} type="text" defaultValue={"email"} value={email}/>
                </div>
            </div>
            <h1 className={styles.Title}>My Courses</h1>
            <div className={styles.Grid}>
                {isUserLoggedIn && isCurrentUser && 
                <Card 
                    onCardClick={onAddCardClick}
                    style={{height: '50%'}} 
                    key={-1} Title='Add Course' 
                    Description='Click To create a new course' 
                    Image={addImg}
                />}
                {courses.map((val:any, i)=>{
                    return <Card key={i} Title={val.Name} Description={val.Intro} Image={val.img}/>
                })}
            </div>
            <PopupCard isVisible={popup} setPopup={setPopup}>
                <div className={popupStyles.InputHolder}>
                    <h1 className={popupStyles.Title}>Create a new course</h1>
                    <InputField customStyle={{backgroundColor: '#FFF', width: '20rem'}} value={courseName} set={setCourseName} label={"Course Name"} />
                    <textarea value={intro} onChange={e=>setIntro(e.target.value)} placeholder='Intro...' className={popupStyles.InputField} name="" id=""></textarea>
                    <button onClick={CreateCourse} className={buttonStyles.PrimaryButton}>Create</button>
                </div>
            </PopupCard>
            <Footer />
        </div>
    )
}

