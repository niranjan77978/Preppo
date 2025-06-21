import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, createBrowserRouter } from 'react-router-dom';
import './App.css'
  import Courses from './pages/Subjects';
import Quiz from './pages/Quiz';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import { RouterProvider } from 'react-router-dom';
import Header from './components/common/Header';
import DynamicQuiz from './components/DynamicQuiz';
import AllQuizzes from './components/quiz/AllQuizzes';

const Layout = ({ children, showHeader = false }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-1 ">
      <div className="">
        {<Header/>}
        {children}
      </div>
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout ><Home /></Layout>
  },
  {
    path: "/quiz",
    element: <Layout ><Quiz /></Layout>
  },
  {
    path: "/courses", 
    element: <Layout><Courses /></Layout>
  },
  {
    path:"quiz/:subject",
    element: <Layout><AllQuizzes/></Layout>
  },
  {
    path:"quiz/:subject/:quizNumber",
    element: <Layout><DynamicQuiz/></Layout>  
  }
]);
function App() {


  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}


export default App
