import styles from './Card.module.css';
import img from '../1080archy.png';
import { getApi } from '../../APIHandler/apiHandler';
import { useNavigate } from 'react-router-dom';

export function Card({Title = "Title", Description = "Temp paragraph", Image=img, style, onCardClick}) {
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
        </div>
    )   
}