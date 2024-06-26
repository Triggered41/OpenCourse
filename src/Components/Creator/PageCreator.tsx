// So after banging my head against the wall for hours finally I found out
// 1. YOU NEED 'formula' in Fin formats to allow formulas
// 2. Write formula in data-value='expression' of a span tag along with class='ql-formula'
// directly inserting, dangerouslyPaste, set value to rendered katex output won't work


import { RefObject, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Page.module.css'
import './check.css'
import { getSection } from '../../APIHandler/apiHandler';
import { useLocation } from 'react-router-dom';
import hljs from 'highlight.js'
import "highlight.js/styles/atom-one-dark.css";
import katex from 'katex'
import 'katex/dist/katex.css'
import { Delta } from 'quill/core';

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

Quill.register(CustomFormulaBlot, true);

window.katex = katex

hljs.configure({
  languages: ["python"],
});

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],

  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  [{ indent: "-1" }, { indent: "+1" }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ align: [] }],
  [{'background': []}],
  ['formula']
];
const modules = {
  history: {
    delay: 10000
  },
  syntax: {
    highlight: function (text: string) {
      return hljs.highlight(text, { language: 'python', ignoreIllegals: true}).value;
    },
  },
  toolbar: toolbarOptions,
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  formula: true,
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
  "background"
];

var caretposition = 0;
var arr: any = []
var key = false
var ind = 0

export function PageCreator() {
  const { state }= useLocation()
  const [value, setValue] = useState('<span class="ql-formula" data-value="f(x)=\\frac{1}{x}">asd</span>');
  const editorRef:RefObject<ReactQuill> = useRef(null)

  useEffect(()=>{
    getSection(state.sectionID).then(data=>{
      console.log(data)
        setValue(Latex(`f(x)=x^2+1`))
    })
    if (editorRef.current)
    editorRef.current.onEditorChangeSelection = (next, src, editor)=>{
        
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
    arr.forEach((ele:any)=>{
        fv = val.replace(/\$\$(.*)\$\$/gs, Latex(ele[0]))
        setTimeout(() => {
            editorRef.current?.editor?.setSelection(selection!.index, 0)
        }, 10);
    })
    setValue(fv)
  }

  const onOK = () =>{
    console.log("Button Clicked")
    if (editorRef.current?.editor?.getSelection()){
        editorRef.current?.editor?.insertText(editorRef.current?.editor?.getSelection()?.index!, '$$ typeHere $$', 'silent')
    }
  }
  return (
    <div>
      <ReactQuill 
          modules={modules}
          formats={formats}
          ref={editorRef}
          className={styles.Editor}
          theme="snow"
          value={value}
          onChange={onChange}
          />
          <button onClick={onOK}>OK</button>
    </div>
  )
}

function Latex(expression:string) {
  return `<span class='ql-formula' data-value='${expression}'></span>`
}

function MathExp(expression: string) {
    // there was some problem with auto inserting $$ so,
    // intentionally left ending $$, so now user has to explicitly end with $$ to end latex writing
	return `$$ ${expression} `
}