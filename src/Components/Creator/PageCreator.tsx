// So after banging my head against the wall for hours finally I found out
// 1. YOU NEED 'formula' in Fin formats to allow formulas
// 2. Write formula in data-value='expression' of a span tag along with class='ql-formula'
// directly inserting, dangerouslyPaste, set value to rendered katex output won't work


import { useEffect, useRef, useState } from 'react';
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
  "formula"
];

export function PageCreator() {
  const { state }= useLocation()
  const [value, setValue] = useState('<span class="ql-formula" data-value="f(x)=\\frac{1}{x}">asd</span>');
  const editor:any = useRef(null)
  

  useEffect(()=>{
    const a = katex.renderToString("f(x)\\frac{x}{2}", { output: 'html'})
    getSection(state.sectionID).then(data=>{
      console.log(data)
      // editor.current.editor.clipboard.dangerouslyPasteHTML(a);

        setValue(`<span class='ql-formula e' 
        data-value='
        f(x)=\\frac{1}{x^{-e}}
        '
        >
        </span>
        `)
    })
  }, [])


  const onChange = (val: string) => {
    // const re = /\/ma(.*)ma\//
    // console.log(val)
    // if (val)
    // const m = val.match(re)![1]
    // if (m != ''){

    // }
    console.log("VALUE: ", val)
    setValue(val)
  }

  return (
    <div>
      <ReactQuill 
          modules={modules}
          formats={formats}
          ref={editor}
          className={styles.Editor}
          theme="snow"
          value={value}
          onChange={onChange}
          />
    </div>
  )
}

