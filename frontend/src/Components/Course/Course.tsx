import { RefObject, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';

import styles from './Course.module.css'
import Bar from "../NavBar/NavBar.tsx";
import { getApi } from "../../APIHandler/apiHandler.tsx";
import ReactQuill from "react-quill";
import hljs from "highlight.js";
import { Sidebar } from '../SideBar/Sidebar.tsx'
import { useNavigate } from "react-router-dom";

async function getData(){
    
    const params: ObjectX = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop:string) => searchParams.get(prop),
      });
    console.log(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const request = await getApi(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const data = await request.json();
    return data;
}

const module = {
    toolbar: false,
    syntax: {
        highlight: (code:string)=>hljs.highlightAuto(code).value
    }
}
const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
    "formula",
    "color",
    "background",
    "image",
    "video"
  ];

export function Course() {
    const quillRef: RefObject<ReactQuill> = useRef(null);
    const [isReadOnly, setReadOnly] = useState(false)
    const nav = useNavigate()

    const loadSection = () => {
        getData()
        .then(res=>{
            const quill = quillRef.current?.getEditor()
            if (res){
                // ele.current!.innerHTML = res.Content
                quill!.setContents(JSON.parse(res.Content), 'user')
                setReadOnly(true)

            }else{
                quill?.setText("Name: 404: Chapter or Section not found")
            }
        })
    }

    useEffect(()=>{
        loadSection()
    }, [])

    const onSectionClick = (chapterIndex:number, sectionIndex:number) => {
        setReadOnly(false)
        nav(`${window.location.pathname}?chp=${chapterIndex}&sec=${sectionIndex}`)
        loadSection()
    }

    return (
        <>
        <Bar />
        <Sidebar onSectionClick={onSectionClick}/>
        <ReactQuill 
        readOnly={isReadOnly}
        ref={quillRef}
        className={styles.Editor}
        modules={module}
        formats={formats}
        theme="snow"/>
        </>
    )
}