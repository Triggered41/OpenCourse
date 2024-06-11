import { useEffect, useState } from "react";

import popupStyles from './popup.module.css'
import buttonStyles from '../Button/ButtonStyles.module.css'

export function PopupCard({setPopup, eleRef, children, isVisible}) {
    function close() {
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
            <button onClick={close} className={buttonStyles.Close}>X</button>
            {children}
        </div>
        </div>
    )
}