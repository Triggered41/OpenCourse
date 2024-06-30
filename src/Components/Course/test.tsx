import React, { useEffect, useRef, useState } from 'react';
import Editor from '../QuillEditor/Editor';
import Quill from 'quill';
import { Delta } from 'quill/core';
// import katex from 'katex'
// import 'katex/dist/katex.css'
// window.katex = katex

export const Test = () => {
  const [range, setRange] = useState();
  const [lastChange, sl] = useState()
  const [readOnly, setReadOnly] = useState(false);

  // Use a ref to access the quill instance directly
  const quillRef:any = useRef();

  useEffect(()=>{
    const quill = quillRef.current
    // First registered handler.
    const firstHandler = () => {
      const sel = quill.getSelection()
      quill.off("text-change", firstHandler);

      if (sel.index>0){
        var temp:string = quill.getText()
        var match = temp.match(/(?<=\$\$\s+).*?(?=\s+\$\$)/gs)
        if (match){
          console.log("Math ", match)
          console.log("ok: ", sel.index-match[0].length)
          quill.deleteText(sel.index-match[0].length-6, match[0].length+6, "user");
          try {
            quill.insertText(sel.index-match[0].length-6, ' ', "formula", match[0])
          } catch (error) {
            
          }
        }
      }


      quill.on("text-change", firstHandler);
    };
    quill.on("text-change", firstHandler);

    quill.on('selection-change', (range: { index: number, length: number }, oldRange: { index: number, length: number }, source: string)=>{
        console.log(range.index)
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


  const onCha = (old: Delta) => {
    // console.log(old)
    // quillRef.current.root.innerHTML = Latex('f(x)')
    // quillRef.current.updateContents(new Delta().insert("helo"))
  }

  return (
    <div>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={new Delta().insert('f(x)')}
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

function Latex(expression:string) {
    return `$$ ${expression} `
  }