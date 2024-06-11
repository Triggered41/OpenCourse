import { useState } from "react"


export function Draggable({itemList, setItemList, Item, Decoy, keyIndex, setKeyIndex}){
    // const[keyIndex, setKeyIndex] = useState(itemList.length)
    
    const[heldItem, setHeldItem] = useState()
    const[empty, setEmpty] = useState({id:-1})

    // When an element is grabbed (ev is the grabbed element)
    const onDragStart = (ev) => {
        console.log("Start: ", ev.target)
        setHeldItem({
            index: ev.target.dataset.index,
            value: ev.target.dataset.value})
        console.log("grabbed: ", ev.target.dataset.index,
            ' : ', ev.target.dataset.value
        )

    }

    // Whenever the grabbed element moves on top of another element (e is the the element already in place)
    const[overlapElement, setOverlapElement] = useState()
    const onDragOver = (e) => {
        e.preventDefault()
        var index = e.target.dataset.index
        if (index != undefined && overlapElement != index){
            index = parseInt(index)
            setOverlapElement(index)
            var temp = [...itemList]
            const element = {id:keyIndex, index: index, type: 'Empty', value:heldItem.value}
            setKeyIndex(keyIndex+1)
            temp = temp.filter(val=>val.id!=empty.id)
            temp.splice(index, 0, element)

            // console.log(temp)
            setEmpty(element)
            setItemList(temp)
        }
    }

    const onDrop = (ev) => {
        ev.preventDefault()
        console.log("Drop")
    }

    // When let go of grabbed element
    const OnDragEnd = (ev) => {
        console.log("END")
        var temp = [...itemList]
        temp = temp.filter(val=>val.id!=empty.id)
        temp = temp.filter(val=>val.index!=heldItem.index)
        const element = {id: keyIndex, index: empty.index, value: heldItem.value}
        setKeyIndex(keyIndex+1)
        temp.splice(empty.index, 0, element)

        temp.forEach((ele, i)=>{
            ele.index = i;
        })

        setEmpty({id:-1})
        setHeldItem({index: -1, value:''})
        console.log("ENDED: ", temp)
        setItemList(temp)
    }

    return (
        <div>
            {itemList.map((val, i)=>
                val.type ? <Decoy key={val.id} /> :
                <Item key={val.id} id={val.id} index={val.index}
                    value={val.value}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={OnDragEnd}
                    
                />
            )}
        </div>
    )
    
}