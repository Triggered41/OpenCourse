import { useEffect, useRef, useState } from 'react'
import styles from './Form.module.css'
import ErrorAnim from './error_anim.module.css'
import { Link, json, useNavigate } from 'react-router-dom';
import { url } from '../URL';
import { onFieldChange } from '../InputField/inputFieldAnim';
import { postApi, setToken } from '../../APIHandler/apiHandler';
import Bar from '../NavBar/NavBar';
import { InputField } from '../InputField/InputField';

export function LoginForm() {
    const userRef = useRef();
    const passRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [userFound, setUserFound] = useState(true)
    const nav = useNavigate();

    useEffect(()=>{
        document.body.style.overflow = 'hidden'
    }, [])

    const onSubmit = (ev)=>{
        ev.preventDefault();
        errRef.current.classList.remove(ErrorAnim.Error)
        postApi('login', {User: user, Password: pass})
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setToken(data.token);
            if (data.UserName){
                nav(`/user/${data.UserName}`)
                nav(0)
            }else{
                errRef.current.classList.add(ErrorAnim.Error)
            }
            setUserFound(!!data.UserName)
        });
    }
    return (
        <>
        <Bar />
        <form className={styles.Form} onSubmit={onSubmit}>
            <div className={styles.InputHolder}>
                <h3 ref={errRef} style={{position: 'absolute', top: '9rem', color: 'red'}}>{!userFound && "User not found"}</h3>
                <h1 className={styles.Title}>LOGIN</h1> 
                <InputField name='User' type='text' label={user.includes('@') ? 'Email' : 'UserName or Email'} value={user} set={setUser}/>
                <InputField name='Pass' type='password' label={'Password'} value={pass} set={setPass}/>
                <input type="submit" />
                <Link style={{marginTop: '8px'}} to={'/register'}>Create an account</Link>
            </div>
        </form>
        </>
    )
}