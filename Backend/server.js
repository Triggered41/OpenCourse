import { register, login, getUser, getCourse, createCourse, updateUser, deleteCourse, updateCourse } from './dbconn.js';

import { join } from 'path';
import cors from 'cors';
import express from 'express'
import 'vite-express'
import fs from 'fs';
import session from 'express-session';
import cookieParser from 'cookie-parser';
const app = express();

import path from 'path';
import jwt from 'jsonwebtoken';
import { auth } from './authenticate.js';
const __dirname = path.resolve();

app.use(express.static(join(__dirname, 'dist')))
app.use(cors({
    origin: ['http://192.168.1.5:5173', 'http://localhost:5173'],
    credentials: true,
}))
app.use(session({ secret: 'wingsofpidgeon', saveUninitialized: true, resave: true}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/register', (req, res) => {
    const user = req.body;
    console.log("Registering ", user);
    register({Name: user.Name, UserName: user.UserName, Email: user.Email, Password: user.Pass})
    .then((doc)=>res.json({code: 0}))
    .catch(err => res.json({code: err.code, keyValue: err.keyValue}))

})

app.use('/api/checkLogin', auth, (req, res) => {
    if (req.data?.user){
        res.json({isUserLoggedIn: true, isCurrentUser: req.data?.user==req.body.UserName})
    }else{
        res.json({isUserLoggedIn: false, isCurrentUser: false})
    }
})

app.use('/api/login', (req, res) => {
    const user = req.body;
    user.User = user.User.toLocaleLowerCase()

    login(user)
    .then(data=>{
        if (data){
            jwt.sign({user: data.UserName}, "wingsofpidgeon", {expiresIn: '10m'}, (err, token) => {
                if (err) throw err;
                console.log("Login successful: ", data);
                console.log("Token generated: ", token);
                res.cookie('token', token, {maxAge: 600000})
                res.json({UserName: data.UserName})
            })
            
        }else{
            console.log("User does not exist");
            res.json({id: false})
        }

    })
    .catch(err => console.log(err));
})

app.post('/api/CreateCourse', auth, (req, res) => {
    const data = req.body
    getUser(req.data.user, {_id: 1})
    .then(user=>{
        createCourse(data.CourseName, data.Intro, user._id)
        .then(course => {
            console.log("US: ", course)
            updateUser(user._id, course._id).then(
                res.json("Course successfully created")
            )
        })
        .catch(err=>{console.error(err)})
    })

})

app.post('/api/UpdateCourse/:CourseName', auth, (req, res) => {
    var data = req.body;
    console.log(data)
    updateCourse(req.data.user, req.params.CourseName, data.courseName, data.intro, data.chapters)
})

app.delete('/api/DeleteCourse/:Course', auth, (req, res) => {
    console.log("Deleting:", req.data.user+ "'s Course",req.params.Course)
    deleteCourse(req.data.user, req.params.Course)
    
})

app.use('/api/addSection', (req, res) => {
    var data = req.body;
    addSection(req.session.courseID, data.Name)
    res.json(`Section ${data.name} added`);
})

app.post('/api/user/:UserName', (req, res) => {
    const params = req.params
    getUser(params.UserName, {_id: 0, UserName: 0}, 'Name Intro -_id').then(
        user => res.json(user)
    )
})

app.post("/api/user/:UserName/:Course", (req, res)=>{
    const data = req.params
    getCourse(data.UserName, data.Course)
    .then(course => res.json(course))

})

app.get("/api/user/:UserName/:Course/id", (req, res)=>{
    console.log(req.query)
    const params = req.params; 
    const query = req.query; 
    getCourse(params.UserName, params.Course, {Name: 1, Content: 1})
    .then(course => {
        const section = course.Chapters[query.chp].Sections[query.sec]
        console.log(section)
        res.json(section)
    })
    
})
app.use('*', (req, res)=>{
    res.sendFile(join(__dirname, 'dist/index.html'))
})
  
app.listen(3300, "192.168.1.5", ()=>{
    console.log("Server Started at 3300");
})