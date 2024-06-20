// import { useEffect, useState } from "react";

import popupStyles from './popup.module.css'
import { ReactNode, RefObject } from 'react'
import { CloseButton } from '../Button/Buttons'

interface PopupCardProps{
    setPopup?: Function | undefined,
    eleRef?: RefObject<HTMLDivElement>,
    children?: ReactNode,
    isVisible?: boolean
}


export function PopupCard({setPopup, eleRef, children, isVisible}: PopupCardProps) {
    function close() {
        if (!setPopup) return
        setPopup(false)
    }

    document.onkeyup = (ev) => {
        if(ev.code == 'Escape'){
            close()
        }
    }

    return (
        <div className={popupStyles.BG}>
        
        <div ref={eleRef} className={`${popupStyles.Popup} ${isVisible && popupStyles.Reveal}`}>
            <CloseButton onClick={close}/>
            {/* <button onClick={close} className={buttonStyles.Close}>X</button> */}
            {children}
        </div>
        </div>
    )
}