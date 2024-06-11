import { useRef, useState } from "react"
import styles from './Draggable.module.css'
import img from '../BGTeddy.png'

export function Draggable({ Items, Decoy }){
    const okref = useRef()
    const temp = Items.map((val, i)=>{
        return {id: i, index: i, value: val}
    })
    const[itemList, setItemList] = useState(temp)
    const[keyIndex, setKeyIndex] = useState(Items.length)
    
    const[heldItem, setHeldItem] = useState()
    const[empty, setEmpty] = useState({id:-1})

    // When an element is grabbed (ev is the grabbed element)
    const onDragStart = (ev) => {
        console.log("Start: ", ev.target)
        const index = ev.target.dataset.index;
        setHeldItem({
            index: index,
            value: itemList.find((val)=>val.index == index)
            })  

        okref.current.innerHTML = ev.currentTarget.getElementsByTagName('h2')[0].innerHTML
        ev.dataTransfer.setDragImage(okref.current, 0, 0)
    }

    // Whenever the grabbed element moves on top of another element (e is the the element already in place)
    const[overlapElement, setOverlapElement] = useState()
    const onDragOver = (e) => {
        e.preventDefault()
        var index = e.currentTarget.dataset.index
        console.log("Over: ", index)
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
        var temp = [...itemList]
        temp = temp.filter(val=>val.id!=empty.id)
        temp = temp.filter(val=>val.index!=heldItem.index)
        const element = {id: keyIndex, index: empty.index, value: heldItem.value}
        setKeyIndex(keyIndex+1)
        temp.splice(empty.index, 0, element.value)
        
        temp.forEach((ele, i)=>{
            ele.index = i;
        })
        console.log("Value: ", element)
        console.log("Temp: ", temp)
        
        setEmpty({id:-1})
        setHeldItem({index: -1, value:''})
        console.log("ENDED: ", temp)
        setItemList(temp)
    }


    return (
        <div>
            {itemList.map((item, i)=>
                item.type ? Decoy :
                <div
                    key={item.id}
                    draggable='true'
                    data-index={item.index}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={OnDragEnd}
                >
                    {item.value}
                </div>

                // <Item key={val.id} id={val.id} index={val.index}
                //     value={val.value}
                //     onDragStart={onDragStart}
                //     onDragOver={onDragOver}
                //     onDragEnd={OnDragEnd}
                    
                // />
            )}
        <div ref={okref} className={styles.Ghost}>SERSLY</div>
        </div>
    )
    
}