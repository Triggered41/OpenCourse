import { CSSProperties, MouseEvent } from 'react';
import styles from './ButtonStyles.module.css'

interface ButtonProps{
    style?: CSSProperties;
    onClick: Function;
}

interface PrimaryButtonProps extends ButtonProps{
    text: string;
    isDisabled?: boolean;
}

interface CloseButtonProps extends Omit<ButtonProps, 'onClick'>{
    onClick?: Function;
}

export function PrimaryButton({text, style, isDisabled, onClick}: PrimaryButtonProps){

    return (
        <button disabled={isDisabled} onClick={(e)=>onClick!(e)} style={isDisabled ? {pointerEvents: 'none'} : style} className={styles.PrimaryButton}>{text}</button>
    )
}

export function CloseButton({onClick, style}:CloseButtonProps) {
    return (
        <>
        {onClick && <button onClick={(e: MouseEvent)=>onClick(e)} style={style} className={styles.Close}>X</button>}
        </>
    )
}