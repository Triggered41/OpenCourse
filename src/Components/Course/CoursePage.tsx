import styles from './CoursePage.module.css'
import buttonStyles from '../Button/ButtonStyles.module.css'

import Bar from "../NavBar/NavBar.tsx"

// import img1 from '../BGTeddy.png'
import addImg from './AddImg.png'

import { ImgTextSection } from '../ImgTextSection.tsx'
import { MouseEvent, RefObject, useEffect, useRef, useState } from 'react'
import Footer from '../Footer.tsx'
import { useNavigate } from 'react-router-dom'
// import { url } from '../URL'
import { postApi } from '../../APIHandler/apiHandler.tsx'
import { PopupCard } from '../Popup/Popup.tsx'
import { InputField } from '../InputField/InputField'
import { FaDeleteLeft } from 'react-icons/fa6'
import { FaRegEdit } from 'react-icons/fa'
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, UniqueIdentifier, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ChapterProps{
    title: string,
    sections: AnyObject,
    chapter: Number,
    id: UniqueIdentifier,
    setPopup: Function
}

interface SectionProps{
    title: string,
    chp_id: Number|string,
    id: Number
}

interface SectionFieldProps{
    index?: any,
    id: UniqueIdentifier,
    remove?: Function
}

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
    const[chapters, setChapters]: Array<any> = useState([])

    useEffect( ()=>{
        getCourse()
        .then(course=>{
            setTitle(course.Name)
            setIntro(course.Intro)

            var temp:Array<any> = []
            course.Chapters.forEach((chapter: AnyObject, i: number) => {
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

// id of dndkit's sortable items can't be zero so keep it at least 1
var keyIndex = 1 
export function Course({chaps}:{chaps:Array<any>}) {
    
    const[sections, setSections] = useState<Array<any>>([])
    const[popup, setPopup] = useState(false)

    const[chapters, setChapters]: any = useState([])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0.1 // Delay if .1s to distinguish b/w click n drag
              }
        }),
        useSensor(TouchSensor)
    )
    
    useEffect(()=>{
        if (chaps.length > 0){
        const temp = chaps.map(chp=>{
            return {id: chp.id+1, Chapter: chp.id, Title: chp.Name, Sections: chp.Sections}
        })
        console.log('tempL ', temp)
        setChapters(temp)
        }

    },[chaps])
    
    const addChapter = () => {
        setPopup(true)
    }
    
    const addSection = () => {
        console.log("OK: ", keyIndex)
        const temp = [...sections, {id: keyIndex++, index: sections.length}]
        setSections(temp)

    }

    const removeSection = (id: Number) => {
        console.log('E: ', id)
        const temp = sections.filter(((section:any) => section.id != id));
        temp.forEach((val:any, i:Number)=>val.index=i)
        setSections(temp)
    }

    const onDragEnd = (ev: DragEndEvent, type?: string) => {
        const { active, over } = ev
        if (active.id === over?.id) return;

        var temp = (array: any) => {
            const activeID = array.findIndex((sec: any)=>sec.id==active.id)
            const overID = array.findIndex((sec: any)=>sec.id==over?.id)
            console.log(activeID, ' : ', overID)
            return arrayMove(array, activeID, overID)
        }

        if (type){
            setChapters(temp)

        }else{
            setSections(temp)
        }
    }

    return (
        <div>
            
            <DndContext sensors={sensors} onDragEnd={e=>onDragEnd(e, 'chapters')} collisionDetection={closestCorners}>
            <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
            {chapters.map((chapter: any)=>
                <Chapter key={chapter.id} chapter={chapter.Chapter} setPopup={setPopup} id={chapter.id} title={chapter.Title} sections={chapter.Sections}/>
            )}
            </SortableContext>
            </DndContext>

            <div onClick={addChapter} className={styles.Section}>
                <h2 className={styles.Title}><img className={styles.AddImg} src={addImg} alt="" /></h2>
            </div>

            <PopupCard isVisible={popup} setPopup={setPopup}>
                <form className={styles.Form}>
                    <InputField customStyle={{backgroundColor: '#DDD'}} label={'Chapter Name'}/>
                    
                    <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
                        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                        {
                        sections.map((val: any) => 
                            <SectionField key={val.id} id={val.id} index={val.index} remove={removeSection}/>
                        )}
                        </SortableContext>
                    </DndContext>

                    <h2 onClick={addSection} draggable='false' className={styles.Title}><img draggable='false' className={styles.AddImg} src={addImg} alt="" /></h2>
                    
                    <center>
                        <input className={buttonStyles.PrimaryButton} type="submit" value="Confirm" />
                    </center>

                </form>
            </PopupCard>
            
        </div>
    )
}


export function Chapter({title, sections, id, chapter, setPopup}: ChapterProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const ele: RefObject<HTMLDivElement> = useRef(null);
    const symbol: RefObject<HTMLHeadingElement> = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    console.log("Chp: ", chapter)
    const items = (sections.map((item: any, i: any)=>(
        <Section key={i} chp_id={chapter} id={i} title={item.Name+': '+(item.Content??'')}/>
    )))

    
    const onClick = () => {
        console.log("HELO")
        ele.current!.style.height = isOpen ? '0px' : (items.length*47)+'px';
        symbol.current!.setAttribute("data-symbol", isOpen ? ' ▸' : '    ▾');
        console.log(id)
        setIsOpen(!isOpen)
    }
    const onEditClick = (ev: MouseEvent|TouchEvent) => {
        ev.stopPropagation()
        setPopup(true)
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    useEffect(()=>{
        console.log("ID: ", id)
    }, [])


    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styles.Section}>
            <div className={styles.box} onClick={onClick}>
                <FaRegEdit onClick={onEditClick} className={buttonStyles.Edit}/>
                <h2 ref={symbol} data-symbol=" ▸" className={styles.Title}>{title}</h2>
            </div>
            <div ref={ele} className={styles.List}>
                {items}
            </div>
        </div>
    )
}

export function Section({title, chp_id, id}: SectionProps) {
    const nav = useNavigate()

    const onSectionClick = () => {
        console.log(`Chapter: ${chp_id} Section: ${id}`)
        var path = window.location.pathname
        path = path.slice(-1)=='/' ? path : path+'/'

        nav(`${path}id?chp=${chp_id}&sec=${id}`)
    }
    return (
        <p onClick={onSectionClick} className={styles.Item}>{title}</p>
    )
}

function SectionField({id, index, remove}: SectionFieldProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    useEffect(()=>{
        console.log("ID: ", id)
    }, [])


    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <InputField customStyle={{backgroundColor: '#DDD'}} label={`Section ${index}`}>
                <FaDeleteLeft onClick={()=>remove?remove(id):undefined} color='red' size={'1.5rem'} className={styles.Remove}/>
            </InputField>
        </div>
    )
}


// function EmptySection({title}: {title: string}){
//     return (
//         <p className={styles.Item}>{title}</p>
//     )
// }
