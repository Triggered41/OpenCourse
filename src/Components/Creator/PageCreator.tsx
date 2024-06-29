// So after banging my head against the wall for hours finally I found out
// 1. YOU NEED 'formula' in Fin formats to allow formulas
// 2. Write formula in data-value='expression' of a span tag along with class='ql-formula'
// directly inserting, dangerouslyPaste, set value to rendered katex output won't work

const tbo:any = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
  
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ indent: "-1" }, { indent: "+1" }],
  
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  
    [{ align: [] }],
    [{color: []}, {'background': []}],
    ['image', 'video'],
    [{'customy': '<p>as</p>'}],
    ['formula'],
    ['undo'],
    ['redo']
  ]


import { RefObject, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Page.module.css'
import './Global.css'
import { getSection, updateSection } from '../../APIHandler/apiHandler';
import { useLocation, useNavigate } from 'react-router-dom';
import hljs from 'highlight.js'
import "highlight.js/styles/atom-one-dark.css";
import katex from 'katex'
import 'katex/dist/katex.css'
import imageResize from 'quill-image-resize-module-react'
import { FaRedo, FaUndo } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import Bar from '../NavBar/NavBar';
import { Sidebar } from '../SideBar/Sidebar';

const icons = ReactQuill.Quill.import('ui/icons')
icons['undo'] = renderToString(<FaUndo/>)
icons['redo'] = renderToString(<FaRedo/>)

Quill.register('modules/imageResize', imageResize);

const FormulaBlot = Quill.import('formats/formula');

class CustomFormulaBlot extends FormulaBlot {
  static create(value:any) {
    const node = super.create();
    katex.render(value, node, { displayMode: true });
    node.setAttribute('data-value', value);
    return node;
  }

  static value(domNode:any) {
    return domNode.getAttribute('data-value');
  }
}

const BlockEmbed = Quill.import('blots/block/embed');

class TweetBlot extends BlockEmbed {
  static blotName = 'tweet';
  static tagName = 'div';
  static className = 'tweet';

  static create(id: string) {
    let node = super.create();
    node.dataset.id = id;
    window.twttr.widgets.createTweet(id, node);
    return node;
  }
  
  static value(domNode:any) {
    return domNode.dataset.id;
  }
}

Quill.register(TweetBlot);
Quill.register(CustomFormulaBlot, true);

window.katex = katex

// hljs.configure({
//   languages: ["python"],
// });

const Toolbar = () => {
    return(
        <div id="toolbar">
    <span className='ql-formats'>
    <select
      className="ql-header"
      defaultValue={''}
      onChange={(e) => e.persist()}
    >
      <option value="1"></option>
      <option value="2"></option>
      <option value="3"></option>
      <option selected></option>
    </select>
    </span>

    <span className='ql-formats'>
        <select className='ql-font'></select>
    </span>
   
    <span className='ql-formats'>
        <button className='ql-undo'></button>
        <button className='ql-redo'></button>
    </span>
    
    <span className='ql-formats'>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
    <select className="ql-color">
        <option selected value="#efefef"></option>
        <option value="#222F"></option>
        <option value="black"></option>
        <option value="red"></option>
        <option value="green"></option>
        <option value="yellow"></option>
        <option value="<input/>"></option>
        <input/>
    </select>
    <select className="ql-background">
    </select>
    </span>


    <span className='ql-formats'>
    <button className='ql-blockquote'></button>
    <button className='ql-link'></button>
    </span>


    <span className='ql-formats'>
    <select className='ql-align'></select>
    <button className='ql-list' value="ordered"></button>
    <button className='ql-list' value="bullet"></button>
    <button className='ql-indent' value={'-1'}></button>
    <button className='ql-indent' value={'+1'}></button>
    </span>

    <span className='ql-formats'>
    <button className='ql-image'></button>
    <button className='ql-video'></button>
    </span>
    
    <span className='ql-formats'>
    <button className='ql-formula'></button>
    <button className='ql-code-block'></button>
    </span>
  </div>

    )
}

var quill: any = null
const tb = {
    container: '#toolbar',
      handlers: {
        customy: function () {                                       
            quill.insertText(quill.getSelection().index, "test");                    
        },
        undo: ()=> quill.history.undo(),
        redo: ()=> quill.history.redo(),

      }
}

const modules = {
history: {
    delay: 1000,
    maxStack: 100,
    userOnly: false
    },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize']
 },
  syntax: {
    highlight: function (text: string) {
      return hljs.highlightAuto(text).value;
    },
  },
  toolbar: tb,
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  formula: true
};

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

var caretposition = 0;
var arr: any = []
var key = false
var useLastPos: boolean = false
var lastPos:number = 0

export function PageCreator() {
  const { state }= useLocation()
  const [value, setValue] = useState('');
  const editorRef:RefObject<ReactQuill> = useRef(null)
  useEffect(()=>{   
    
    quill = editorRef.current!.editor

    // if (quill){

    //     const range = quill!.getSelection(true);
    //     const id = '1776580998215463032';
    //     quill!.insertText(range.index, '\n', 'user');
    //     quill!.insertEmbed(range.index + 1, 'tweet', id, 'user');
    //     quill!.setSelection(range.index+2, 0, 'silent');
    // }



    if (state){
      getSection(state.sectionID).then(data=>{
        console.log(data)
        quill.setContents(JSON.parse(data.Content))
        // setValue(data.Content)
      })
    }
    if (editorRef.current)
    editorRef.current.onEditorChangeSelection = (_next, _src, editor)=>{
        
        document.onkeyup = (ev)=>{
            key = ev.ctrlKey && ev.key=='a'
            console.log("KI: ", key)
        }
        if (key) return
        
		const selection = editor.getSelection(); // Get the current selection
		if (selection) {
            const re = /(?<=\$\$\s+).*?(?=\s+\$\$)/gs
            const m = editor.getText().matchAll(re)
            arr = Array.from(m, x => x)//.index+x[0].length)
            console.log("Matched: ", arr)
            arr = arr.filter((ele:any)=>{
                var pos = editor.getText().indexOf(ele[0])
                return !(caretposition>=(pos)! && caretposition<=(pos!+ele[0].length+1))
            })

			const delta = editor.getContents(selection.index, selection.length);
			if (delta.ops!.length<=0) return
			if (delta.ops![0].insert.formula != undefined){

                const target = document.querySelector('.ql-editor')
                const _range = document.getSelection()!.getRangeAt(0);
                const range = _range.cloneRange()
                const temp = document.createTextNode("\0"); 
                range.insertNode(temp); 
                caretposition = target!.innerHTML!.indexOf("\0"); 
                temp!.parentNode!.removeChild(temp);


				editorRef.current?.editor?.deleteText(selection.index, 1)
                
				editorRef.current?.editor?.insertText(selection.index, MathExp(delta.ops![0].insert.formula), "background", '#0001', 'user')
			}
		} else {
			console.log('No selection found');
		}	
		};
  }, [])


  const onChange = (val: string) => {
    var fv = val
    const selection = editorRef.current?.editor?.getSelection()
    arr.forEach((ele:any,i:any)=>{
		try {
            console.log("Ele: ", ele, ', ', i)
			katex.renderToString(Latex(ele[0]), { output: 'html', displayMode: true, strict: true })
			fv = val.replace(/\$\$(.*)\$\$/gs, Latex(ele[0]))
            useLastPos = true
		} catch (error) {
			alert("There was an error in Latex: " + error);
			console.log(error)
			fv = val.replace(/\$\$(.*)\$\$/gs, "$"+MathExp(ele[0]))
		}
        // setTimeout(() => {
        //     editorRef.current?.editor?.setSelection(selection!.index, 0)
        // }, 10);
    })
    console.log("Selec: ", selection)
    if (useLastPos){
        editorRef.current?.editor?.setSelection(lastPos, 0, 'user')
        lastPos = selection!.index
        useLastPos = false
    }else{
        editorRef.current?.editor?.setSelection(0, 0, 'user')
        editorRef.current?.editor?.setSelection(selection!.index, 0, 'user')
    }
    setValue(fv)
  }

  const onClic = ()=> {
    updateSection({ id: state.sectionID, Content: JSON.stringify(quill.getContents())})
  }
  const onSectionClick = (chp:number, sec:number, id:string ) => {
    console.log("click: ", id)
    state.sectionID = id
    getSection(id).then(data=>{
    console.log(data)
    quill.setContents(JSON.parse(data.Content))
    })
  }

  return (
    <div>
      <Bar />
      <button onClick={onClic}>Click</button>
      <Sidebar onSectionClick={onSectionClick} />
      <Toolbar/>
        <ReactQuill 
            modules={modules}
            formats={formats}
            ref={editorRef}
            className={styles.Editor}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder='       type here...'
            />
            
      </div>
  )
}

function Latex(expression:string) {
  return `<br><span class='ql-formula' data-value="${expression}"></span><br><br><br>`
}

function MathExp(expression: string) {
    // there was some problem with auto inserting $$ so,
    // intentionally left ending $$, so now user has to explicitly end with $$ to end latex writing
	return String.raw`$$ ${expression} `
}