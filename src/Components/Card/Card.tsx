import styles from './Card.module.css';
import img from '../1080archy.png';
// import { getApi } from '../../APIHandler/apiHandler.tsx';
import { useNavigate } from 'react-router-dom';
import { CSSProperties, MouseEvent } from 'react';
import { CloseButton } from '../Button/Buttons';

interface CardProps{
    Title?: string,
    Description?: string,
    Image?: string,
    style?: CSSProperties|undefined,
    onCloseClick?: Function,
    onCardClick?: (event: React.MouseEvent) => void
}

export function Card({Title = "Title", Description = "Temp paragraph", Image=img, style, onCloseClick, onCardClick}: CardProps) {
    const nav = useNavigate()

    const onCourseClick = () => {
        const path = window.location.pathname.slice(-1)=='/' ? window.location.pathname : window.location.pathname+'/'
        nav(path+Title)
    }

    return (
        <div onClick={onCardClick ?? onCourseClick} className={styles.Card}>
            <div className={styles.ImgHolder}>
                <img style={style} src={Image} alt="" className={styles.Image} />
            </div>
            <strong className={styles.Title}>{Title}</strong>
            <div className={styles.Details}>{Description}</div>
            <CloseButton onClick={onCloseClick?(e: MouseEvent)=>onCloseClick(e):undefined}/>
        </div>
    )   
}