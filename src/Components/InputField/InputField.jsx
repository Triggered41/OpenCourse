import { useEffect, useRef, useState } from "react";
import styles from './InputField.module.css'
import { onFieldChange } from "./inputFieldAnim";

export function InputField({name, type, label, value, tempvalue, set, onChange, submitRef, customStyle, Icon, myRef, onFocus, onBlur, data_index, children}) {
    const[text, setText] = useState('');
    const labelRef = useRef();

    useEffect(()=>{
        console.log("tempval", tempvalue)
        if (tempvalue){
            onFieldChange(tempvalue, setText, labelRef)
        }
    }, [])

    return (
        <div ref={myRef} onBlur={onBlur?(e)=>onBlur(e):null} onFocus={onFocus?(e)=>onFocus(e):null} className={styles.InputField}>
            {Icon}
            <input data-index={data_index} className={styles.TypeField} style={customStyle} required name={name} type={type} onChange={(e)=>onChange ? onChange(e.target.value, set ?? setText, labelRef, submitRef) : onFieldChange(e.target.value, set ?? setText, labelRef, submitRef)} value={value ?? text}/>
            <label required className={styles.Label} ref={labelRef} htmlFor="Email">{label ?? 'Label'}</label>
            {children}
        </div>
    )
}