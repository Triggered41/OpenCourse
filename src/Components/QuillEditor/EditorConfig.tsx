
import Quill from "quill";

import 'quill/dist/quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'

import { FaRedo, FaUndo } from "react-icons/fa";
import imageResize from 'quill-image-resize-module-react'
import katex from 'katex';
import { FaXTwitter } from "react-icons/fa6";
import xml from 'highlight.js/lib/languages/xml'
import hljs from "highlight.js";

window.hljs = hljs
// window.hljs.registerLanguage('xml', xml)

Quill.register('modules/imageResize', imageResize);

const FormulaBlot:any = Quill.import('formats/formula');
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

const BlockEmbed:any = Quill.import('blots/block/embed');
class TweetBlot extends BlockEmbed {
  static blotName = 'tweet';
  static tagName = 'div';
  static className = 'tweet';

  static create(id: string) {
    let node = super.create();
    node.dataset.id = id;
    window.twttr.widgets.createTweet(id, node).then((val:any)=>console.log("found: ", val))
    .catch((err:any) => console.log(err))
    return undefined;
  }
  
  static value(domNode:any) {
    return domNode.dataset.id;
  }
}


Quill.register(TweetBlot);
Quill.register(CustomFormulaBlot)
// export const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "code",
//     "code-block",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "align",
//     "formula",
//     "color",
//     "background",
//     "image",
//     "video"
//   ];

var quill: any 
export const setQuill = (val: any) => {
  quill = val
}
export const toolbar = {
  container: '#toolbar',
    handlers: {
      undo: ()=> quill.history.undo(),
      redo: ()=> quill.history.redo(),
      tweet: ()=> console.log("Click!")

    }
}


// hljs.initHighlightingOnLoad()
// hljs.initHighlighting()

export const modules = {
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
      highlight: (a:any)=>{
        console.log("Value: ", a)
        const out = hljs.highlightAuto(a).value
        console.log("Output: ", out)
        return out
      },
      hljs: hljs,
      // languages: [
      //   { key: 'plain', label: 'Plain' },
      //   { key: 'go', label: 'Go' },
      //   { key: 'xml', label: 'html/xml' },
      //   { key: 'rust', label: 'Rust' },
      // ],
      interval: 500,
    },
    toolbar: toolbar,
    clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
    },
    formula: true
};

export const Toolbar = () => {
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
      <option ></option>
    </select>
    </span>

    <span className='ql-formats'>
        <select className='ql-font'></select>
    </span>
   
    <span className='ql-formats'>
      <select className="ql-size"></select>
    </span>

    <span className='ql-formats'>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
    <select defaultValue={'#efefef'} className="ql-color">
        <option value="#efefef"></option>
        <option value="#222F"></option>
        <option value="black"></option>
        <option value="red"></option>
        <option value="green"></option>
        <option value="yellow"></option>
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

    <span className='ql-formats'>
        <button className='ql-tweet'><FaXTwitter /></button>
    </span>

    <span className='ql-formats'>
        <button className='ql-undo'><FaUndo /></button>
        <button className='ql-redo'><FaRedo /></button>
    </span>
    
  </div>

    )
}