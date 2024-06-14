const URLS = "http://192.168.1.5:3300/api/";
const URL = "http://192.168.1.5:3300/api";

var options: ObjectX = {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: {'content-type': 'application/json'}
    
}
console.log(options)

export function joinURL(path: string){
    const temp = path[0]=='/' ? URL : URLS
    return `${temp}${path}`
}

export async function getApi(url: string) {
    const res = await fetch(joinURL(url), {
        mode: 'cors',
        headers: {'content-type': 'application/json'},
        
    })
    return res;
}

export async function postApi(url: string, data: object) {
    options.body = JSON.stringify(data)
    const res = await fetch(joinURL(url), options)
    return res;
}

export function setToken(token: string){
    options.headers.Authorization = `Bearer ${token}`
}