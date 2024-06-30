// import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css';
import './snow.css';
import './custom_toolbar.css';
import App from './App';
import store from './StoreManager/store.ts'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RegisterForm } from './Components/Forms/Register.tsx';
import { LoginForm } from './Components/Forms/Login.tsx';
import { HomePage } from './Components/homepage.tsx';
import { CoursePage } from './Components/Course/CoursePage.tsx';
import { Course } from './Components/Course/Course.tsx';
import { PageCreator } from './Components/Creator/PageCreator.tsx';
import { Profile } from './Components/Profile/Profile.tsx';
import { DragMenu } from './Components/Draggable/testDrag.tsx';
import { Provider } from 'react-redux';
import { Test } from './Components/Course/test.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

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
    path: '/test',
    element: <Test />
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
    path: 'user/:Profile/:Course/Editor',
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
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
