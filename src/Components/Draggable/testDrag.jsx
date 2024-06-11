import { useState } from "react"
import { Draggable } from "./Draggable"

export function DragMenu(){
    var list = [
        <Here msg={'HI'}/>,
        <Here msg={'BYE'}/>,
        <Here msg={'WHY'}/>,
    ]

    return (
        <Draggable Items={list} Decoy={<MeDecoy />}/>
    )
}

function Here({ msg }){
    return (
        <h3 style={{backgroundColor: 'palevioletred'}}>{msg}</h3>
    )
}

function MeDecoy(){
    return (
        <div>Decoy</div>
    )
}