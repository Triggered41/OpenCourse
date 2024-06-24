// Over time it grew what once was a baby is now a huge messy monster, I am sorry!
// I want to clean it up if it's possible at all, but I am tired and lazy and maybe even afraid of breaking 
// something that's working prefectly fine


import styles from './CoursePage.module.css'
import popupStyles from '../Popup/popup.module.css'
import buttonStyles from '../Button/ButtonStyles.module.css'

import Bar from "../NavBar/NavBar.tsx"

import addImg from './AddImg.png'

import { ImgTextSection } from '../ImgTextSection.tsx'
import { MouseEvent, RefObject, useEffect, useRef, useState } from 'react'
import Footer from '../Footer.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourse, updateCourse } from '../../APIHandler/apiHandler.tsx'
import { PopupCard } from '../Popup/Popup.tsx'
import { InputField } from '../InputField/InputField'
import { FaDeleteLeft } from 'react-icons/fa6'
import { FaRegEdit } from 'react-icons/fa'
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, UniqueIdentifier, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PrimaryButton } from '../Button/Buttons.tsx'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setChapters } from '../../Features/Course/courseSlice.ts'

interface ChapterProps{
    title: string,
    sections: AnyObject,
    setSections: Function,
    setChapterName: Function,
    setIsUpdate: Function,
    _id: string,
    id: UniqueIdentifier,
    setPopup: Function
}

interface SectionProps{
    title: string,
    chp_id: Number|string,
    id: Number
}

interface SectionFieldProps{
    id: UniqueIdentifier,
    index?: any,
    tempValue?: string,
    remove?: Function
}


export function CoursePage() {
    const[title, setTitle] = useState('Course Name')
    const[intro, setIntro] = useState('Introduction')

    const chapters = useSelector(( state:any )=> state.course.value)
    const dispatch = useDispatch()

    const[popup, setPopup] = useState(false)
    const params = useParams()

    useEffect( ()=>{

        getCourse()
        .then(course=>{
            setTitle(course.Name)
            setIntro(course.Intro)

            var temp:Array<any> = []
            course.Chapters.forEach((chapter: AnyObject, i: number) => {
                temp.push({id: i+1, _id: chapter._id, Name: chapter.Name, Sections:chapter.Sections})
            });
            console.log("Chapters: ", temp)
            dispatch(setChapters(temp))
            
        })
    },[])

    const onEditClick = () => {
        setPopup(true);
    }

    const onUpdateClick = () => {
        console.log('Updating: ', chapters)
        updateCourse(params.Course!, title, intro, chapters)
    }

    return (
        <div>
            <Bar />
            <ImgTextSection onEditClick={onEditClick} title={title} text={intro}/>
                <br/>
            <Course />
            <PopupCard isVisible={popup} setPopup={setPopup}>
                <div className={popupStyles.InputHolder}>
                    <h1 className={popupStyles.Title}>Update course details</h1>
                    <InputField customStyle={{backgroundColor: '#FFF', width: '20rem'}} value={title} set={setTitle} label={"Course Name"} />
                    <textarea value={intro} onChange={e=>setIntro(e.target.value)} placeholder='Intro...' className={popupStyles.InputField} name="" id=""></textarea>
                    {/* <button onClick={CreateCourse} className={buttonStyles.PrimaryButton}>Create</button> */}
                    {/* <PrimaryButton onClick={onUpdateClick} text='Create'/> */}
                </div>
            </PopupCard>
            <div className={styles.Section}>
                <h2 className={styles.Title}><PrimaryButton onClick={onUpdateClick} text='Update'/></h2>
            </div>
            <Footer />
        </div>
    )
}

// id of dndkit's sortable items can't be zero so keep it at least 1
var keyIndex = 1 
export function Course() {
    const chapters = useSelector((state:any) => state.course.value)
    const dispatch = useDispatch()
    
    const[sections, setSections] = useState<Array<any>>([])
    const[popup, setPopup] = useState(false)

    // const[chapters, setChapters]: any = useState([])
    const[chapterName, setChapterName]: any = useState()

    const[isUpdate, setIsUpdate] = useState([false])

    console.log("got: ", chapters)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0.1 // Delay if .1s to distinguish b/w click n drag
              }
        }),
        useSensor(TouchSensor)
    )
    
    const openAddChapterPopup = () => {
        setPopup(true)
        setSections([])
        setIsUpdate([false])
    }

    const addChapter = (currentChapters: any) => {
        const inputs = document.getElementsByTagName('input')
        const temp = [...sections]
        temp.forEach((val, i)=>{
            val.Name = inputs[i+1].value
        })
        currentChapters.push({id:chapters.length+1, Name: chapterName, Chapter: chapters.length+1, Sections: [...sections]})
        dispatch(setChapters(currentChapters))
    }
    const updateChapter = (index: number) => {
        const inputs = document.getElementsByTagName('input')
        const temp_chapters = JSON.parse(JSON.stringify(chapters))
        const temp_sections = [...sections]
        
        temp_sections.forEach((val, i)=>{
            val.Name = inputs[i+1].value
        })

        temp_chapters[index].Name = chapterName;
        temp_chapters[index].Sections = temp_sections;
        dispatch(setChapters(temp_chapters))
        
        
    }

    const onCourseEdit = (event: SubmitEvent) => {
        event.preventDefault()
        
        const temp = [...chapters]
        console.log("IS up: ", isUpdate)
        if (isUpdate[0]){
            const index = chapters.findIndex((val:any)=>val.Name === isUpdate[1])
            updateChapter(index)
        }else{
            addChapter(temp)
        }
        
    }
    
    const addSection = () => {
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
            dispatch(setChapters(temp(chapters)))
        }else{
            setSections(temp)
        }
    }

    return (
        <div>
            
            <DndContext sensors={sensors} onDragEnd={e=>onDragEnd(e, 'chapters')} collisionDetection={closestCorners}>
            <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
            {chapters.map((chapter: any)=>
                <Chapter setIsUpdate={setIsUpdate} setChapterName={setChapterName} key={chapter.id} _id={chapter._id} setPopup={setPopup} id={chapter.id} title={chapter.Name} sections={chapter.Sections} setSections={setSections}/>
            )}
            </SortableContext>
            </DndContext>

            <div onClick={openAddChapterPopup} className={styles.Section}>
                <h2 className={styles.Title}><img className={styles.AddImg} src={addImg} alt="" /></h2>
            </div>
            

            <PopupCard isVisible={popup} setPopup={setPopup}>
                <form onSubmit={(e:any)=>onCourseEdit(e)} className={styles.Form}>
                    <InputField value={chapterName} tempvalue={chapterName} set={setChapterName} customStyle={{backgroundColor: '#DDD'}} label={'Chapter Name'}/>
                    
                    <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
                        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                        {
                        sections.map((val: any) => 
                            <SectionField key={val.id} id={val.id} index={val.index} tempValue={val.Name} remove={removeSection}/>
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


export function Chapter({title, sections, setSections, setChapterName, setIsUpdate, _id, id, setPopup}: ChapterProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const ele: RefObject<HTMLDivElement> = useRef(null);
    const symbol: RefObject<HTMLHeadingElement> = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    console.log("Chp: ", id)
    const items = (sections.map((item: any, i: any)=>(
        <Section key={i} chp_id={id} id={i} title={item.Name}/>
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
        const temp: AnyObject = sections.map((sec:any, i:Number)=>{
            return {id: keyIndex++, _id:sec._id, Name: sec.Name, index: i}
        })
        
        setIsUpdate([true, title])
        setChapterName(title)
        setSections(temp)
        setPopup(true)
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styles.Section}>
            <div className={styles.box} onClick={onClick}>
                <FaRegEdit onClick={onEditClick} className={buttonStyles.Edit}/>
                <h2 id='chapter' data-id={_id} ref={symbol} data-symbol=" ▸" className={styles.Title}>{title}</h2>
            </div>
            <div id='sections' ref={ele} className={styles.List}>
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

function SectionField({id, index, tempValue, remove}: SectionFieldProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <InputField tempvalue={tempValue} customStyle={{backgroundColor: '#DDD'}} label={`Section ${index}`}>
                <FaDeleteLeft onClick={()=>remove!(id)} color='red' size={'1.5rem'} className={styles.Remove}/>
            </InputField>
        </div>
    )
}
