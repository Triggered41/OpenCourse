import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

import Quill from 'quill';
import { modules } from './EditorConfig';

import 'highlight.js/lib/languages/python'
import 'highlight.js/styles/atom-one-dark.css'
// Editor is an uncontrolled React component
const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange, className }:any, ref:any) => {
    const containerRef:any = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      // console.log("HLJS: ", window.hljs)
      // window.hljs.highlightAll()
      // hljs.highlightAll
      const container:any = containerRef.current;
      const editorContainer = container!.appendChild(
        container!.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        modules: modules,
        // formats: ["code-block"],
        // formats: ["code-block"],
        placeholder: "Type here...",
        theme: 'snow',
      });
      console.log("quill: ",quill)

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
      };

    }, [ref]);

    return <div className={className} ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;