import styles from './ImgTextSection.module.css'
import img from './1080archy.png'

export function ImgTextSection({title, text, quotes, image=img}){
    return (
        <div className={styles.About}>
            <div className={styles.ImgHolder}>
                <img className={styles.Image} src={image} alt="" />
            </div>
            <div className={styles.TextBox}>
                <h1 className={styles.Title}>{title}</h1>
                <div className={styles.Description + ' ' + (quotes ? styles.Quotes : '')}>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}