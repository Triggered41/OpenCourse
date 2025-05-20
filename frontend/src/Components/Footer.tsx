import styles from './Footer.module.css'

export default function Footer(){
    const onTopClick = () => {
        window.scrollTo(0, 0);
    }
    return(
        <footer className={styles.Footer}>
            <h1>Thank You!</h1>
            <div><button className={styles.button} onClick={onTopClick}>Back To Top</button></div>
        </footer>
    )
}