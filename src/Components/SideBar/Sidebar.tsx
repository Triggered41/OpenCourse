import { useSelector } from 'react-redux'
import styles from './sidebar.module.css'
import { MouseEvent, RefObject, useEffect, useRef, useState } from 'react'

interface ChapterProps {
    Name: string,
    Sections: ObjectX,
    ChapterIndex: Number,
    onSectionClick: Function
}

interface SidebarProps{
    onSectionClick: Function
}

export function Sidebar({onSectionClick}: SidebarProps){
    const [course, setCourse]: any = useState()
    const [selected, setSelected]: any = useState()

    useEffect(()=>{
        const rawData = localStorage.getItem('Course')
        if (rawData === null) return
        setCourse(JSON.parse(rawData))
    }, [])

    const onChildSectionClick = (chp:any, sec:any, ref:MouseEvent, id:string) => {
        onSectionClick(chp, sec, id)
        // console.log(ref.currentTarget.classList)
        if (selected){
            selected.classList.remove(styles.Selected)
        }
        const temp = ref.currentTarget
        temp.classList.add(styles.Selected)
        setSelected(temp)
    }
    return (
        <div className={styles.Sidebar}>
            {
            course && course.map((val:ObjectX, i:number)=>(
                <Chapter key={i} onSectionClick={onChildSectionClick} ChapterIndex={i+1} Name={val.Name} Sections={val.Sections}/>
            ))
            }
        </div>
    )
}

function Chapter({Name, Sections, ChapterIndex, onSectionClick}:ChapterProps) {
    const [isCollapsed, setCollapsed] = useState(true)
    const chapterRef: RefObject<HTMLHeadingElement> = useRef(null)
    const foldableRef: RefObject<HTMLDivElement> = useRef(null)

    const onChapterClick = () => {
        console.log(Sections.length+'rem')
        foldableRef.current!.style.height = isCollapsed ? 3*Sections.length+'rem' : '0rem'
        foldableRef.current!.style.color = isCollapsed ? 'black' : 'white'
        chapterRef.current!.dataset.symbol = isCollapsed ? '▾' : '▸' 

        setCollapsed(!isCollapsed)
    }

    return(
        <>
        <h3 ref={chapterRef} onClick={onChapterClick} data-symbol="▸" className={styles.Chapter} >{Name}</h3>
            <div ref={foldableRef} className={styles.Foldable}>
                {Sections.map((val:any, i:any)=>(
                    <p key={i} onClick={(e)=>onSectionClick(ChapterIndex, i+1, e, val._id)} className={styles.Section}>{val.Name}</p>
                ))}
            </div>
        </>
    )
}