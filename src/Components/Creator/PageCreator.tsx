import { RefObject, useEffect, useRef, useState } from 'react';

import Editor from '../QuillEditor/Editor';
import Quill from 'quill';
import 'highlight.js/styles/atom-one-dark.css'
import { Delta } from 'quill/core';
import { Toolbar, setQuill, toolbar } from '../QuillEditor/EditorConfig';
import { FaRegClipboard } from 'react-icons/fa';
import { InputField } from '../InputField/InputField';
import { PrimaryButton } from '../Button/Buttons';
import { useLocation } from 'react-router-dom';
import { getSection, updateSection } from '../../APIHandler/apiHandler';
import { Sidebar } from '../SideBar/Sidebar';
// import styles from './Page.module.css'
import styles from './Page.module.css'
import './Global.css'
import Bar from '../NavBar/NavBar';

// toolbar.handlers.tweet = ()=>{
  
// }

export const PageCreator = () => {
  const { state }= useLocation()
  const [range, setRange] = useState();
  const [lastChange, sl]:any = useState()
  const [readOnly, setReadOnly] = useState(false);
  const [buttons, setButtons]:any = useState([])
  
  // Use a ref to access the quill instance ; 
  const quillRef:RefObject<any> = useRef(null);

  useEffect(()=>{

    const quill = quillRef.current
    setQuill(quill)

    if (state){
        getSection(state.sectionID).then(data=>{
          console.log(data)
          quill.setContents(JSON.parse(data.Content))
          // setValue(data.Content)
        })
      }

    // First registered handler.
    const firstHandler = () => {
      const sel = quill.getSelection()
      quill.off("text-change", firstHandler);
      console.log(sel)
      if (sel.index>0){
        var temp:string = quill.getText()
        var match = temp.match(/(?<=\$\$\s+).*?(?=\s+\$\$)/gs)
        if (match){
          console.log("Math ", match)
          console.log("ok: ", sel.index-match[0].length)
          quill.deleteText(sel.index-match[0].length-6, match[0].length+6, "user");
          try {
            console.log("IN: ", sel.index-match[0].length-4)
            setTimeout(() => {
              quill.setSelection(sel.index-match![0].length-4, 0)
            }, 10);
            quill.insertText(sel.index-match[0].length-6, ' ', "formula", match[0])
          } catch (error) {
            
          }
        }
      }


      quill.on("text-change", firstHandler);
    };
    quill.on("text-change", firstHandler);

    quill.on('selection-change', (range: { index: number, length: number }, oldRange: { index: number, length: number }, source: string)=>{
        const con: Delta = quill.getContents(range.index, range.length)
        if (!con) return
        if (con.ops.length == 0) return
        const form:any = con.ops[0].insert
        if (form.formula){
          console.log("formula clicked: ", con)
          quill.deleteText(range.index, 1)
          quill.insertText(range.index, Latex(form.formula))
        }
      })
  },[])



  const CopyButton = () => {
    const text = document.createTextNode('Copy')
    const ele = document.createElement('div')
    ele.classList.add('ql-code-block')
    ele.classList.add('copy-button')
    ele.appendChild(text)
    return ele
  }

  window.onscroll = (e)=>{
    const blocks = document.querySelectorAll('.ql-code-block-container')
    var temp:any = []
    blocks.forEach(block => {
      const box = block.getBoundingClientRect()
      // console.log("pos: ", box)
      temp.push({x: box.x, pos: box.y, data:block})
    })
    setButtons(temp)
    // console.log(quillRef.current.getContents())
}
  const onCha = (old: Delta) => {
  }

  const onSectionClick = (id: string) => {
    const quill = quillRef.current
    console.log("click: ", id)
    state.sectionID = id
    getSection(id).then(data=>{
    console.log(data)
    quill.setContents(JSON.parse(data.Content))
    })

  }
  const save = () => {
    updateSection({id:state.sectionID, Content: JSON.stringify(quillRef.current.getContents())})
  }

  return (
    <div>
      <Bar />
      <button onClick={save}>OK</button>
      <Toolbar />
      <Tweet quill={quillRef.current}/>
      <Sidebar onSectionClick={onSectionClick} />
      {buttons.map((val:any, i:number)=>(
        <Copy key={i} data={val} />
      ))}
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        // defaultValue={new Delta([{'insert': `<body id="A">`}, {attributes: {'code-block':'xml'}, insert: '\n'}])}
        className={styles.Editor}
        onSelectionChange={setRange}
        onTextChange={onCha}
        
      />
      <div className="controls">
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          className="controls-right"
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength());
          }}
        >
          Get Content Length
        </button>
      </div>
      <div className="state">
        <div className="state-title">Current Range:</div>
        {range ? JSON.stringify(range) : 'Empty'}
      </div>
      <div className="state">
        <div className="state-title">Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
      </div>
      
    </div>
  );
};

function Copy({data}: {data: ObjectX}) {
  const ref:RefObject<HTMLDivElement> = useRef(null)

  useEffect(()=>{
    console.log("Ref: ", ref.current)
    console.log("Refs POs: ", ref.current!.dataset!.pos)
  }, [])


  
  const onClick = () => {
    var code = ''
    const codeBlock = data.data.querySelectorAll('.ql-code-block')
    codeBlock.forEach((val:any)=>code += val.textContent + '\n')

    navigator.clipboard.writeText(code).then(val=>console.log(val))
  }

  return (
    <div ref={ref} onClick={onClick} className='copy-button' style={{translate: `0 ${data.pos}px`}}><FaRegClipboard/></div>
  )
}

function Tweet({quill}: {quill: any}) {
    const [value, setValue]:any = useState('')
    const [inputBox, setInputBox]:any = useState('none')

    toolbar.handlers.tweet = ()=>setInputBox('block')
    
    const onClick = () => {
        const range = quill.getSelection(true);
        quill.insertText(range.index, '\n', Quill.sources.USER);
        quill.insertEmbed(range.index + 1, 'tweet', value, Quill.sources.USER);
        quill.setSelection(range.index + 2, Quill.sources.SILENT)
        setInputBox('none')

    }

    return (
        <div style={{position: 'fixed', display: inputBox, top: '50vh', left: '50vw', zIndex: 1}}>
            <InputField set={setValue} value={value} />
            <PrimaryButton onClick={onClick} text='Confirm' />
        </div>
    )
}

function Latex(expression:string) {
    return `$$ ${expression} `
}