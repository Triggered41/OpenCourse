import { useEffect, useRef, useState } from "react";
import { url } from "../URL";

import styles from './Course.module.css'
import Bar from "../NavBar/NavBar";
import { getApi } from "../../APIHandler/apiHandler";

async function getData(){
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
    console.log(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const request = await getApi(`${window.location.pathname}?chp=${params.chp}&sec=${params.sec}`)
    const data = await request.json();
    return data;
}

export function Course(props) {
    const [data, setData] = useState({Name: "Title", Content: 'Loading...'})
    const ele = useRef();

    useEffect(()=>{
        getData()
        .then(res=>{
            if (res){
                setData(res)
                ele.current.innerHTML = res.Content
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