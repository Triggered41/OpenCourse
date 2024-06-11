import { getApi } from "../../APIHandler/apiHandler"
import { url } from "../URL"

export function Test(params) {
    getApi('User/Vehdat/Manim')
    .then(res=>res.json())
    .then(d=>console.log(d))
    return (
        <div>
            Hello
        </div>
    )
}