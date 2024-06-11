import styles from './HomePage.module.css'
import img from './1080archy.png'
import img1 from './BGTeddy.png'

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import Bar from './NavBar/NavBar'
import { ImgTextSection } from './ImgTextSection'
import { Card } from './Card/Card'
import Footer from './Footer'

const url = 'http://localhost:3300/';

export function HomePage(params) {
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
var interval = null
const change_image = () =>{
    const images = [img1, img];
    interval = setInterval(() => {
        if (window.location.pathname != '/'){
            clearInterval(interval)
            return
        }
        const ele = document.querySelector(`.${styles.ShowCase}`);
        ele.style.backgroundImage = `url(${images[imgIndex]})`
        imgIndex = (imgIndex+1)%images.length;
    }, 5000);
}
clearInterval(interval);
window.onload = change_image();

export function ShowCase(params) {
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

export function Grid(params) {
    return (
        <div className={styles.Grid}>
            <Card />
            <Card />
            <Card />
        </div>
    )
}