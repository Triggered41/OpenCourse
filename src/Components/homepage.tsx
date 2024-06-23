import styles from './HomePage.module.css'
import img from './1080archy.png'
import img1 from './BGTeddy.png'

import { useNavigate } from "react-router-dom"
import Bar from './NavBar/NavBar'
import { ImgTextSection } from './ImgTextSection.tsx'
import { Card } from './Card/Card'
import Footer from './Footer'
// const url = 'http://localhost:3300/';

export function HomePage() {
    return (
        <>
        <Bar />
        <ShowCase />
        <Grid />
        <ImgTextSection quotes={true} title={'About Me!'} text={`I am Vehdat Hamid an aspiring developer hoping to make some positive difference in the world
                    with my work, I created this website as a way for everyone to learn from an open platform
                    where any one can post top quality courses.`}/>                                                                                                                                                                                                                                               
        <Footer />
        </>
    )
}

// Chaging the BG Image
var imgIndex = 0;
var interval:ReturnType<typeof setInterval>|undefined = undefined
const change_image:Function = () =>{
    const images = [img1, img];
    interval = setInterval(() => {
        if (window.location.pathname != '/'){
            clearInterval(interval)
            return
        }
        const ele:HTMLElement = document.querySelector(`.${styles.ShowCase}`) as HTMLElement;
        ele.style.backgroundImage = `url(${images[imgIndex]})`
        imgIndex = (imgIndex+1)%images.length;
    }, 5000);
}
window.onload = change_image();
clearInterval(interval);

export function ShowCase() {
    const nav = useNavigate();

    const onClick = ()=>{
        clearInterval(interval);
        nav('/Courses')
    }

    return (
        <div className={styles.ShowCase}>
            <div className={styles.BgBlur}>
                <button className={styles.button} onClick={onClick}>Learn ►</button>
            </div>
            {/* <img src={img} alt="Show Case Image" /> */}
        </div>
    )
}

export function Grid() {
    return (
        <div className={styles.Grid}>
            <Card />
            <Card />
            <Card />
        </div>
    )
}