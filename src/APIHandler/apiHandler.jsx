const URLS = "http://localhost:3300/api/";
const URL = "http://localhost:3300/api";

var options = {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'content-type': 'application/json'},
    
}
console.log(options)

export function joinURL(path){
    const temp = path[0]=='/' ? URL : URLS
    return `${temp}${path}`
}

export async function getApi(url) {
    const res = await fetch(joinURL(url), {
        mode: 'cors',
        headers: {'content-type': 'application/json'},
        
    })
    return res;
}

export async function postApi(url, data) {
    options.body = JSON.stringify(data)
    const res = await fetch(joinURL(url), options)
    return res;
}

export function setToken(token){
    options.headers.Authorization = `Bearer ${token}`
}