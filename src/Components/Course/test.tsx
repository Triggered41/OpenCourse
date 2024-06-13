import { getApi } from "../../APIHandler/apiHandler.tsx"
// import { url } from "../URL"

export function Test() {
    getApi('User/Vehdat/Manim')
    .then(res=>res.json())
    .then(d=>console.log(d))
    return (
        <div>
            Hello
        </div>
    )
}