import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log("token: ", token)
    if (token){
        jwt.verify(token, "wingsofpidgeon", (err, data) => {
            if (err){
                console.log(res)
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