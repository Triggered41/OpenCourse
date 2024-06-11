import styles from './Form.module.css'
import ErrorAnim from './error_anim.module.css'
import { useEffect, useRef, useState } from "react"
import { onFieldChange } from '../InputField/inputFieldAnim';
import { Link } from 'react-router-dom';
import { postApi } from '../../APIHandler/apiHandler';
import Bar from '../NavBar/NavBar';
import { InputField } from '../InputField/InputField';
import { Tooltip } from '../InputField/Tooltip';

export function RegisterForm(params) {
    const passRef = useRef();
    const submitRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [cPass, setCPass] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [isFocus, setIsFocus] = useState(false);
    const [err, setErr] = useState([false, false, false, false, false]);
    const [rule, setRule] = useState([false, false, false, false]);

    const onPassFocus = () => {
        setIsFocus(true)
    }
    const onPassBlur = () => {
        setIsFocus(false)
    }

    const onPassChange = (val, set, ref, submitRef) => {
        onFieldChange(val, set, ref, submitRef)
        var temp = [false, false, false, false]
        temp[0] = val.length >= 8
        temp[1] = new RegExp(/[a-z]/).test(val);
        temp[2] = new RegExp(/[A-Z]/).test(val);
        temp[3] = new RegExp(/[0-9]/).test(val);
        temp[4] = new RegExp(/\W/).test(val);
        temp[5] = temp[0] && temp[1] && temp[2] && temp[3] && temp[4]
        var errArr = err
        errArr[3] = !temp[5] && errArr[3]
        
        setRule(temp);
        setErr(errArr);
    }

    const onSubmit = (ev)=>{
        ev.preventDefault();
        errRef.current.classList.remove(ErrorAnim.Error)

        const flags = "gm";
        const pattern = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
        const regexPattern = new RegExp(pattern, flags);
        if (!email.match(regexPattern)) return false;
        
        const errArr = err
        errArr[3] = pass !== cPass || !rule[5]
        errArr[4] = pass !== cPass
        
        setErr(errArr)
        pass !== cPass ? setErrMsg("Passwords don't match") : !rule[5] ? setErrMsg("Password isn't strong enough") : ''
        submitRef.current.disabled = pass !== cPass || !rule[5]
        if (pass !== cPass || !rule[5]){
            errRef.current.classList.add(ErrorAnim.Error)
            return;
        }
        
        postApi('register', {Name: name, UserName: userName, Email: email, Pass: pass})
            .then(res => res.json())
            .then(data => {
                if (data.code === 0){
                    alert("Registered succesfully")
                }else if(data.code === 11000){
                    const key = Object.keys(data.keyValue)[0]
                    const errArr = err;
                    console.log(key === 'Email')
                    errArr[1] = key === 'UserName';
                    errArr[2] = key === 'Email';
                    setErrMsg(`${key} already exists`)
                    setErr(errArr)
                }
            })
    }

    return (
        <>
        <Bar />
        <form className={styles.Form} onSubmit={onSubmit}>
            <p ref={errRef} style={{position: 'absolute', top: '5rem', color: 'red'}}>{errMsg}</p>
            <div className={styles.InputHolder}>
                <h1 className={styles.Title}>Register</h1>
                <InputField label={'Name'} name={'Name'} type={'text'} value={name} set={setName} submitRef={submitRef}
                Icon={err[0] && <p className={ErrorAnim.Warning}>⚠</p>} />

                <InputField label={'Username'} name={'UserName'} type={'text'} value={userName} set={setUserName} submitRef={submitRef}
                Icon={err[1] && <p className={ErrorAnim.Warning}>⚠</p>} />

                <InputField label={'Email'} name={'email'} type={'email'} value={email} set={setEmail} submitRef={submitRef}
                Icon={err[2] && <p className={ErrorAnim.Warning}>⚠</p>} />

                <InputField onFocus={onPassFocus} onBlur={onPassBlur} myRef={passRef} onChange={onPassChange} label={'Password'} name={'pass'} type={'password'} value={pass} set={setPass} submitRef={submitRef}
                Icon={err[3] && <p className={ErrorAnim.Warning}>⚠</p>}>
                    <Tooltip rules={rule} isFocused={isFocus} />
                </InputField>
                
 
                <InputField label={'Confirm Password'} name={'cPass'} type={'password'} value={cPass} set={setCPass} submitRef={submitRef}
                Icon={err[4] && <p className={ErrorAnim.Warning}>⚠</p>} />
                
                <input ref={submitRef} type="submit" />
                <Link style={{marginTop: '8px'}} to={'/login'}>Already registered</Link>
            </div>
        </form>
        </>
    )
}