import styles from './ImgTextSection.module.css'
import img from './1080archy.png'
import { FaRegEdit } from 'react-icons/fa'

interface ImgTextSectionProps{
    title: string,
    text: string,
    quotes?: boolean,
    image?: string,
    onEditClick?: Function
}

export function ImgTextSection({title, text, quotes, image=img, onEditClick}: ImgTextSectionProps){
    return (
        <div className={styles.About}>
            <div className={styles.ImgHolder}>
                <img className={styles.Image} src={image} alt="" />
            </div>
            <div className={styles.TextBox}>
                <h1 className={styles.Title}>{title}</h1>
                <FaRegEdit onClick={e=>onEditClick!(e)} className={styles.EditButton}/>
                <div className={styles.Description + ' ' + (quotes ? styles.Quotes : '')}>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}