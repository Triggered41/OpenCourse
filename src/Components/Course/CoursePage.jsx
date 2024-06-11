import styles from './CoursePage.module.css'
import buttonStyles from '../Button/ButtonStyles.module.css'

import Bar from "../NavBar/NavBar"

import img1 from '../BGTeddy.png'
import addImg from './AddImg.png'

import { ImgTextSection } from '../ImgTextSection'
import { useEffect, useReducer, useRef, useState } from 'react'
import Footer from '../Footer'
import { useNavigate } from 'react-router-dom'
import { url } from '../URL'
import { postApi } from '../../APIHandler/apiHandler'
import { PopupCard } from '../Popup/Popup'
import { InputField } from '../InputField/InputField'
import { FaDeleteLeft } from 'react-icons/fa6'
import { Draggable } from '../Draggable/Draggable'

const getCourse = async () => {
    console.log("OK: ", window.location.pathname)
    const response = await postApi(window.location.pathname, {})
    const data = await response.json();
    console.log("data: ", data)
    return data;
}

export function CoursePage() {
    const[title, setTitle] = useState('Course Name')
    const[intro, setIntro] = useState('Introduction')
    const[chapters, setChapters] = useState([])

    useEffect( ()=>{
        getCourse()
        .then(course=>{
            setTitle(course.Name)
            setIntro(course.Intro)

            var temp = []
            course.Chapters.forEach((chapter, i) => {
                temp.push({id: i, Name: chapter.Name, Sections:chapter.Sections})
            });
            setChapters(temp)
        })
    },[])

    return (
        <div>
            <Bar />
            <ImgTextSection title={title} text={intro}/>
                <br/>
            <Course chaps={chapters}/>
            <Footer />
        </div>
    )
}

var keyIndex = 0
export function Course({chaps}) {
    
    const[sections, setSections] = useState([])
    const[popup, setPopup] = useState(false)
    
    const[heldItem, setHeldItem] = useState()
    const[empty, setEmpty] = useState({id:-1})

    const[chapters, setChapters] = useState()
    // const chapters = chaps.map(chp=>(
    //         <Chapter key={chp.id} id={chp.id} title={chp.Name} sections={chp.Sections}/>
    //     ))

    useEffect(()=>{
        if (chaps.length > 0){
            const temp = chaps.map(chp=>(
                <Chapter key={chp.id} id={chp.id} title={chp.Name} sections={chp.Sections}/>
            ))
            console.log("Chapters: ", chaps)
            console.log("Temp: ", temp)
            setChapters(temp)
        }
    }, [chaps])
    
    const addChapter = () => {
        setPopup(true)
    }
    
    const addSection = () => {
        console.log("OK: ", keyIndex)
        const temp = [...sections, {id: keyIndex++, index: sections.length}]
        setSections(temp)

    }

    const removeSection = (id) => {
        console.log('E: ', id)
        const temp = sections.filter(section => section.id != id);
        temp.forEach((val, i)=>val.index=i)
        setSections(temp)
    }

    // When an element is grabbed (ev is the grabbed element)
    const onDragStart = (ev) => {
        console.log("Start: ", ev.target)
        setHeldItem({
            index: ev.target.dataset.index,
            value: ev.target.getElementsByTagName('input')[0].value})
        console.log("grabbed: ", ev.target.dataset.index, ', ', ev.target.getElementsByTagName('input')[0].value)

    }

    const[overlapElement, setOverlapElement] = useState()
    // Whenever the grabbed element moves on top of another element (e is the the element already in place)
    const onDragOver = (e) => {
        e.preventDefault()
        var index = e.target.dataset.index
        if (index != undefined && overlapElement != index){
            index = parseInt(index)
            setOverlapElement(index)
            var temp = [...sections]
            const element = {id:keyIndex++, index: index, type: 'Empty', value:heldItem.value}
            temp = temp.filter(val=>val.id!=empty.id)
            temp.splice(index, 0, element)

            // console.log(temp)
            setEmpty(element)
            setSections(temp)
        }
    }

    // When let go of grabbed element
    const onDragEnd = () => {
        var temp = [...sections]
        temp = temp.filter(val=>val.id!=empty.id)
        temp = temp.filter(val=>val.index!=heldItem.index)
        const element = {id: keyIndex++, index: empty.index, value: heldItem.value}
        temp.splice(empty.index, 0, element)

        temp.forEach((ele, i)=>{
            ele.index = i;
        })

        setEmpty({id:-1})
        setHeldItem({index: -1, value:''})
        console.log("ENDED: ", temp)
        setSections(temp)
    }

    return (
        <div>
            {chapters?<Draggable Items={chapters} Decoy={<EmptySection key={(keyIndex++)+10} title={'Drop Here?'}/>} />:''}
            {/* {chaps.map(chp=>(
                <Chapter key={chp.id} id={chp.id} title={chp.Name} sections={chp.Sections}/>
            ))} */}
            <div onClick={addChapter} className={styles.Section}>
                <h2 className={styles.Title}><img className={styles.AddImg} src={addImg} alt="" /></h2>
            </div>
            <PopupCard isVisible={popup} setPopup={setPopup}>
            <form className={styles.Form}>
                <InputField customStyle={{backgroundColor: '#DDD'}} label={'Chapter Name'}/>
                {
                    sections.map((val) => 
                        val.type ? <Empty value={val.value} key={val.id}/> : <SectionField value={val.value} OnDragEnd={onDragEnd} onDragOver={onDragOver} onDragStart={onDragStart} key={val.id} id={val.id} index={val.index} remove={removeSection}/>
                    )
                }
                <h2 onClick={addSection} draggable='false' className={styles.Title}><img draggable='false' className={styles.AddImg} src={addImg} alt="" /></h2>
                
                <center>
                <input className={buttonStyles.PrimaryButton} type="submit" value="Confirm" />
                </center>
            </form>
            </PopupCard>
        </div>
    )
}


export function Chapter({title, sections, id}) {
    const ele = useRef();
    const symbol = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const items = (sections.map((item, i)=>(
        <Section key={i} chp_id={id} id={i} title={item.Name+': '+(item.Content??'')}/>
    )))

    
    const onClick = (ev) => {
        ele.current.style.height = isOpen ? '0px' : (items.length*47)+'px';
        symbol.current.setAttribute("data-symbol", isOpen ? ' ▸' : '    ▾');
        console.log(id)
        setIsOpen(!isOpen)
    }

    return (
        <div draggable='false' className={styles.Section}>
            <h2 draggable='false' onClick={onClick} ref={symbol} data-symbol=" ▸" className={styles.Title}>{title}</h2>
            <div draggable='false' ref={ele} className={styles.List}>
                {items}
                {/* {<Draggable Items={items} Decoy={<EmptySection key={(keyIndex++)+10} title={'Drop Here?'}/>} />} */}
            </div>
        </div>
    )
}

export function Section({title, chp_id, id}) {
    const nav = useNavigate()

    const onSectionClick = () => {
        console.log(`Chapter: ${chp_id} Section: ${id}`)
        var path = window.location.pathname
        path = path.slice(-1)=='/' ? path : path+'/'

        nav(`${path}id?chp=${chp_id}&sec=${id}`)
    }
    return (
        <p draggable='false' onClick={onSectionClick} className={styles.Item}>{title}</p>
    )
}

function SectionField({index, id, remove, value, onDragOver, onDragStart, onDrop, OnDragEnd}) {
    return (
        <div data-index={index} draggable='true' onDragEnd={OnDragEnd} onDrop={onDrop} onDragStart={onDragStart} onDragOver={onDragOver}>
            <InputField tempvalue={value} data_index={index} customStyle={{backgroundColor: '#DDD'}} label={`Section ${index}`}>
                <FaDeleteLeft onClick={e=>remove(id)} color='red' size={'1.5rem'} className={styles.Remove}/>
            </InputField>
        </div>
    )
}

function Empty({value}){
    return (
        <div className={styles.Empty}>
        <InputField label={value} />
        </div>
    )
}

function EmptySection({title}){
    return (
        <p className={styles.Item}>{title}</p>
    )
}
