import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css';
import './snow.css';
import './custom_toolbar.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RegisterForm } from './Components/Forms/Register';
import { LoginForm } from './Components/Forms/Login';
import { HomePage } from './Components/homepage';
import { CoursePage } from './Components/Course/CoursePage';
import { Course } from './Components/Course/Course';
import { Test } from './Components/Course/test';
import { PageCreator } from './Components/Creator/PageCreator';
import { Profile } from './Components/Profile/Profile';
import { Card } from './Components/Card/Card';
import { InputField } from './Components/InputField/InputField';
import { PopupCard } from './Components/Popup/Popup';
import { Draggable } from './Components/Draggable/Draggable';
import { DragMenu } from './Components/Draggable/testDrag';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: '/app',
    element: <App />
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/login",
    element: <LoginForm />
  },
  {
    path: '/user/:Profile',
    element: <Profile />
  },
  {
    path: '/user/:Profile/:Course',
    element: <CoursePage />
  },
  {
    path: 'user/:Profile/:Course/id',
    element: <Course />
  },
  {
    path: 'user/:Profile/PageCreator',
    element: <PageCreator />
  },
  {
    path: '/test',
    element: <DragMenu />
  },  
  {
    path: '*',
    element: <div>404: page not found</div>
  }
]);

root.render(
  // <React.StrictMode>
  //   {/* <App /> */}
  // </React.StrictMode>
    <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
