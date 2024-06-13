// import React, { useState, useRef, useEffect } from 'react';
// import './styles.module.css'
// import {Editor} from './Editor';
// import Quill from 'quill';

// const Delta = Quill.import('delta')
// import './Page.css'
// import { useParams } from 'react-router-dom';

// var pressed_keys = {}
// window.addEventListener("keydown", (ev)=>{
//   pressed_keys[ev.key] = true;
//   console.log(typeof(ev.key))
//   if (pressed_keys["Control"] && pressed_keys["s"] && document.activeElement == document.querySelector('.ql-editor')){
//     ev.preventDefault()
//     saveCourse()
//   }
// })
// window.addEventListener("keyup", (ev)=>{
//   delete pressed_keys[ev.key];
// })

// export function PageCreator() {
//   const [range, setRange] = useState();
//   const [lastChange, setLastChange] = useState();
//   const [readOnly, setReadOnly] = useState(false);
//   const {Profile} = useParams();

//   useEffect(() => {
//     console.log("Page Creator opened by:",Profile)
//   },[])

//   const onChange = (e) => {
//     console.log(e)
//     setLastChange(e)
//   }
//   // Use a ref to access the quill instance directly
//   const quillRef = useRef();
//   return (
//     <div>
//     <Editor
//       ref={quillRef}
//       readOnly={readOnly}
//       defaultValue={new Delta()
//         .insert('Hello')
//         .insert('\n', { header: 1 })
//         .insert('Some ')
//         .insert('initial', { bold: true })
//         .insert(' ')
//         .insert('content', { underline: true })
//         .insert('\n')}
//       onSelectionChange={setRange}
//       onTextChange={setLastChange}
//     />
//     <div className="controls">
//       <label>
//         Read Only:{' '}
//         <input
//           type="checkbox"
//           value={readOnly}
//           onChange={(e) => setReadOnly(e.target.checked)}
//         />
//       </label>
//       <button
//         className="controls-right"
//         type="button"
//         onClick={() => {
//           console.log(document.querySelector('.ql-editor').innerHTML)
          
//           // alert(quillRef.current?.getLength());
//         }}
//       >
//         Get Content Length
//       </button>
//     </div>
//     <div className="state">
//       <div className="state-title">Current Range:</div>
//       {range ? JSON.stringify(range) : 'Empty'}
//     </div>
//     <div className="state">
//       <div className="state-title">Last Change:</div>
//       {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
//     </div>
//   </div>
//   )
// }