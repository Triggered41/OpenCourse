import { useState } from "react"


var keyIndex = 4
export function DragMenu(){
    
    const[itemList, setItemList] = useState([
        {id: 0, index: 0, value: 'Hi'},
        {id: 1, index: 1, value: 'Who'},
        {id: 2, index: 2, value: 'Are'},
        {id: 3, index: 3, value: 'You?'},
    ])

    return (
        <Draggable itemList={itemList} setItemList={setItemList} Item={DragMe} Decoy={MeDecoy}/>
    )
}


export function Draggable({itemList, setItemList, Item, Decoy}){

    
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
            const element = {id:keyIndex++, index: index, type: 'Empty', value:heldItem.value}
            temp = temp.filter(val=>val.id!=empty.id)
            temp.splice(index, 0, element)

            // console.log(temp)
            setEmpty(element)
            setItemList(temp)
        }
    }

    // When let go of grabbed element
    const onDragEnd = () => {
        var temp = [...itemList]
        temp = temp.filter(val=>val.id!=empty.id)
        temp = temp.filter(val=>val.index!=heldItem.index)
        const element = {id: keyIndex++, index: empty.index, value: heldItem.value}
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
                    onDragEnd={onDragEnd}
                />
            )}
        </div>
    )
    
}


function DragMe({id, index, value, onDragStart, onDragOver, onDragEnd, children }){
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