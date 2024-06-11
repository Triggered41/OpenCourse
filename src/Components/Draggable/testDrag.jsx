import { useState } from "react"
import { Draggable } from "./Draggable"

export function DragMenu(){
    const[key, setKey] = useState(4)
    const[itemList, setItemList] = useState([
        {id: 0, index: 0, value: 'Hi'},
        {id: 1, index: 1, value: 'Who'},
        {id: 2, index: 2, value: 'Are'},
        {id: 3, index: 3, value: 'You?'},
    ])
    
    return (
        <Draggable itemList={itemList} keyIndex={key} setKeyIndex={setKey} setItemList={setItemList} Item={DragMe} Decoy={MeDecoy}/>
    )
}


function DragMe({id, index, value, onDragStart, onDragOver, onDragEnd }){
    return (
        <div
        style={{width: '100%',backgroundColor: 'pink'}}
        draggable='true'
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        data-index={index}
        data-value={value}
        
        >{value}
        </div>
    )
}

function MeDecoy(){
    return (
        <div>Decoy</div>
    )
}