import jwt from 'jsonwebtoken';


export function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log("header token: ", req.headers.authorization?.split(' ')[1])
    console.log("Cookie token: ", req.cookies.token)
    if (token){
        jwt.verify(token, "wingsofpidgeon", (err, data) => {
            if (err != null){
                res.json("Unauthorized");
            }else{
                req.data = data
                next();
            }
        })
    }else{
        res.json("No Login")
    }
}