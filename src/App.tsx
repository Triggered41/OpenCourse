import './App.module.css';
// import React from 'react';
import { Link } from 'react-router-dom'
// import { Chapter } from './Components/Course/CoursePage.tsx';
// import { PageCreator } from './Components/Creator/PageCreator.tsx';



function App() {
  return (
    <div className="App">
        {/* <PageCreator /> */}
        {/* <Chapter title="Chapter 1: Basics" sections={`Manim is built on the idea of objects, 
        properties and animation`} /> */}
        <Link to="/login">Login</Link>
        <br/>
        <Link to="/register">Register</Link>
    </div>
  );
}

export default App;
