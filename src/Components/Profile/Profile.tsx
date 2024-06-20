import styles from './Profile.module.css';
import buttonStyles from '../Button/ButtonStyles.module.css';

import popupStyles from '../Popup/popup.module.css'

import img from '../BGTeddy.png';
import addImg from '../Course/AddImg.png'
import Bar from '../NavBar/NavBar';
import { Card } from '../Card/Card';
import { MouseEvent, RefObject, useEffect, useState } from 'react';
import { deleteApi, postApi } from '../../APIHandler/apiHandler.tsx';
import Footer from '../Footer.tsx';
import { checkLogin } from '../../APIHandler/checkLogin.tsx';
import { useNavigate, useParams } from 'react-router-dom';
// import { onFieldChange } from '../InputField/inputFieldAnim';
import { InputField } from '../InputField/InputField';
import { PopupCard } from '../Popup/Popup';
import { PrimaryButton } from '../Button/Buttons.tsx';
import { onFieldChange } from '../InputField/inputFieldAnim.tsx';


export function Profile() {
    const[name, setName] = useState('My Name')
    const[userName, setUserName] = useState('@My User Name')
    const[email, setEmail] = useState('My Email')
    const[courses, setCourses] = useState([])
    
    const[popup, setPopup] = useState(false);

    const[deletePopup, setDeletePopup] = useState(false);
    const[isDisabled, setIsDisabled] = useState(true)
    const[deleteName, setDeleteName] = useState('');
    const[confirmDelete, setConfirmDelete] = useState('')

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
        if (courseName === '' || intro) return; 
        
        postApi('CreateCourse', {CourseName: courseName, Intro: intro})
        .then(res=>res.json())
        .then(data=>{
            alert(data);
            nav(0)
        })
        .catch(err=>{throw (err)})
    }

    const onCloseClick = (event: MouseEvent, Name: string) => {
        event.stopPropagation();
        setDeletePopup(true)
        setDeleteName(Name)
    }
    const onConfirmChange: any = (val: string, set:Function, ref: RefObject<HTMLElement>, submitRef:RefObject<HTMLButtonElement>) => {
        onFieldChange(val, set, ref, submitRef)
        setIsDisabled(val !== deleteName)
    }
    const onDeleteClick = (event: SubmitEvent) => {
        event.preventDefault()
        deleteApi(`DeleteCourse/${deleteName}`)
        .then(res=>res.json())
        .then(data=>console.log(data))
        .catch(err=>console.log(err))
        console.log('Cookies: ', document.cookie)
        console.log('Deleting: ', `DeleteCourse/${deleteName}`)
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
                    return <Card key={i} Title={val.Name} Description={val.Intro} Image={val.img} onCloseClick={(e: MouseEvent)=>onCloseClick(e, val.Name)}/>
                })}
            </div>
            <PopupCard isVisible={popup} setPopup={setPopup}>
                <div className={popupStyles.InputHolder}>
                    <h1 className={popupStyles.Title}>Create a new course</h1>
                    <InputField customStyle={{backgroundColor: '#FFF', width: '20rem'}} value={courseName} set={setCourseName} label={"Course Name"} />
                    <textarea value={intro} onChange={e=>setIntro(e.target.value)} placeholder='Intro...' className={popupStyles.InputField} name="" id=""></textarea>
                    {/* <button onClick={CreateCourse} className={buttonStyles.PrimaryButton}>Create</button> */}
                    <PrimaryButton onClick={CreateCourse} text='Create'/>
                </div>
            </PopupCard>
            <PopupCard isVisible={deletePopup} setPopup={setDeletePopup}>
                <form>
                    <InputField value={confirmDelete} set={setConfirmDelete} onChange={onConfirmChange}
                    label={`Type "${deleteName}" to confirm`} 
                    customStyle={{backgroundColor: '#DDD'}} />
                    <center>    
                        <PrimaryButton onClick={(e:SubmitEvent)=>onDeleteClick(e)} isDisabled={isDisabled} style={{backgroundColor: '#d82c2c', outlineColor: '#e99f9ff0'}} text='Delete' />
                    </center>
                </form>
            </PopupCard>
            <Footer />
        </div>
    )
}

