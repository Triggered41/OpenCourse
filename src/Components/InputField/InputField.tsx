import { CSSProperties, FocusEventHandler, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import styles from './InputField.module.css'
import { onFieldChange } from "./inputFieldAnim.tsx";

interface InputFieldProp{
    name?: string,
    type?: string,
    label?: string
    value?: string,
    tempvalue?: string,
    set?: Function,
    onChange?: Function,
    submitRef?: RefObject<HTMLButtonElement>,
    customStyle?: CSSProperties,
    Icon?: ReactNode,
    myRef?: RefObject<HTMLDivElement>,
    onFocus?: FocusEventHandler<HTMLElement>,
    onBlur?: FocusEventHandler<HTMLElement>,
    data_index?: Number,
    children?: ReactNode
}

export function InputField({name, type, label, value, tempvalue, set, onChange, submitRef, customStyle, Icon, myRef, onFocus, onBlur, data_index, children}: InputFieldProp) {
    const[text, setText] = useState('');
    const labelRef: RefObject<HTMLLabelElement> = useRef<HTMLLabelElement>(null);

    useEffect(()=>{
        console.log("tempval", tempvalue)
        if (tempvalue){
            onFieldChange(tempvalue, setText, labelRef)
        }
    }, [])

    return (
        <div ref={myRef} onBlur={onBlur?(e)=>onBlur(e):undefined} onFocus={onFocus?(e)=>onFocus(e):undefined} className={styles.InputField}>
            {Icon}
            <input data-index={data_index} className={styles.TypeField} style={customStyle} required name={name} type={type} onChange={(e)=>onChange ? onChange(e.target.value, set ?? setText, labelRef, submitRef) : onFieldChange(e.target.value, set ?? setText, labelRef, submitRef)} value={value ?? text}/>
            <label className={styles.Label} ref={labelRef} htmlFor="Email">{label ?? 'Label'}</label>
            {children}
        </div>
    )
}