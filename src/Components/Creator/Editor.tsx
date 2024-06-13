// import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
// import Quill from 'quill';
// import ImageResize from 'quill-image-resize-module-react'
// import { ImageDrop } from 'quill-image-drop-module'

// Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/imageDrop', ImageDrop)
// // Editor is an uncontrolled React component
// export const Editor = forwardRef(
//   ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
//     const containerRef = useRef(null);
//     const defaultValueRef = useRef(defaultValue);
//     const onTextChangeRef = useRef(onTextChange);
//     const onSelectionChangeRef = useRef(onSelectionChange);

//     useLayoutEffect(() => {
//       onTextChangeRef.current = onTextChange;
//       onSelectionChangeRef.current = onSelectionChange;
//     });

//     useEffect(() => {
//       ref.current?.enable(!readOnly);
//     }, [ref, readOnly]);

//     useEffect(() => {
//       const container = containerRef.current;
//       const editorContainer = container.appendChild(
//         container.ownerDocument.createElement('div'),
//       );
//       const quill = new Quill(editorContainer, {
//         modules: {
//           imageResize: {
//             parchment: Quill.import('parchment'),
//             modules: ['Resize', 'DisplaySize']
//          },
//           toolbar: [
//             ['bold', 'italic', 'underline', 'strike'],        
//               ['blockquote', 'code-block'  ],

//               [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//               [{ 'indent': '-1'}, { 'indent': '+1' }],
//               [{ 'header': [1, 2, 3, 4, false] }],

//               [{ 'color': [] }, { 'background': [] }],          
//               [{ 'font': [] }],
//               [{ 'align': [] }],
//               ['image'],

//               ['clean']                                         
//         ],
//         },
//         imageDrop: true,
//         imageResize: {
//           displayStyles: {
//             backgroundColor: 'black',
//             border: 'none',
//             color: 'white'
//           },
//           modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
//         },
//         theme: 'snow',
//       });

//       ref.current = quill;

//       if (defaultValueRef.current) {
//         quill.setContents(defaultValueRef.current);
//       }

//       quill.on(Quill.events.TEXT_CHANGE, (...args) => {
//         onTextChangeRef.current?.(...args);
//       });

//       quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
//         onSelectionChangeRef.current?.(...args);
//       });

//       return () => {
//         ref.current = null;
//         container.innerHTML = '';
//       };
//     }, [ref]);

//     return <div ref={containerRef}></div>;
//   },
// );

// Editor.displayName = 'Editor';