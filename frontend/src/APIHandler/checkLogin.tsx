import { postApi } from "./apiHandler";

export function checkLogin(setLogIn:Function, user?:string|undefined, setIsUser?:Function){
    // Send current UserName to check if its logged in
    postApi('/checkLogin', {UserName: user})
    .then(res=>res.json()).then(data=>{
        setLogIn(data.isUserLoggedIn);
        if(setIsUser) setIsUser(data.isCurrentUser);
})
}