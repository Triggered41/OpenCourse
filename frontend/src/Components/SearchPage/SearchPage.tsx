import { FormEventHandler, KeyboardEventHandler, useState } from "react"
import { Grid } from "../homepage"
import Bar from "../NavBar/NavBar"
import { searchCourse } from "../../APIHandler/apiHandler"

export const SearchPage = () => {
    const [search, setSearch] = useState('')
    const [courses, setCourses] = useState([])

    const onSubmit = (e: React.KeyboardEvent) => {
        if (e.key == 'Enter'){
            searchCourse(search).then(val => {
                setCourses(val)
            })
        }
    }
    return (
        <div>
            <Bar />
            <SearchField value={search} setValue={setSearch} onSubmit={onSubmit}/>
            <Grid cards={courses} />
        </div>
    )
}

const SearchField = ({value, setValue, onSubmit}: {value: string, setValue: Function, onSubmit: KeyboardEventHandler}) => {
    return (
        <div>
            <input onKeyDown={onSubmit} value={value} onChange={e=>setValue(e.target.value)} type="text" placeholder="search course..." />
        </div>
    )
}