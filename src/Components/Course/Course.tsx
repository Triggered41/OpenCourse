import { RefObject, useEffect, useRef, useState } from "react";
// import { url } from "../URL";

import styles from './Course.module.css'
import Bar from "../NavBar/NavBar.tsx";
import { getApi } from "../../APIHandler/apiHandler.tsx";

async function getData(){
    
    const params: ObjectX = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop:string) => searchParams.get(prop),
      });
    console.log(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const request = await getApi(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const data = await request.json();
    return data;
}

export function Course() {
    const [data, setData] = useState<ObjectX>({Name: "Title", Content: 'Loading...'})
    const ele: RefObject<HTMLDivElement> = useRef(null);

    useEffect(()=>{
        getData()
        .then(res=>{
            if (res){
                setData(res)
                ele.current!.innerHTML = res.Content
            }else{
                setData({Name: "404: Chapter or Section not found"})
            }
        })
    }, [])

    return (
        <>
        <Bar />
        <h1 className={styles.Title} >{data.Name.toUpperCase()}</h1>
        <div className={styles.Content} ref={ele}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi odio
         obcaecati nobis nostrum iusto ad nulla temporibus incidunt blanditiis necessitatibus non
         obcaecati nobis nostrum iusto ad nulla temporibus incidunt blanditiis necessitatibus non
         obcaecati nobis nostrum iusto ad nulla temporibus incidunt blanditiis necessitatibus non
          totam voluptatum, porro vero error culpa autem tempora accusantium.</div>
        </>
    )
}