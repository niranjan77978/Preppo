import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/common/Footer';

const Quiz = () => {
  const navigate = useNavigate();
  
  const navigateToQuiz = (subject) => {
    navigate(`/quiz/${subject}`);
  };
  
  return (
    <>
      <div className='flex items-start justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 p-2'>
        <div className='flex flex-col h-auto mt-14 items-start justify-start overflow-hidden bg-gray-900 border w-full max-w-4xl text-white rounded-xl'>
          <div className='flex flex-col items-center justify-center w-full h-[23%] min-h-[120px] bg-gray-800 border-b'>
            <h1 className='text-2xl md:text-4xl font-extrabold'>Quizzes</h1>
            <p className='text-gray-300 text-xs md:text-sm mt-2 text-center px-4'>Test your knowledge with our quizzes</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-6 md:p-10'>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('cnquiz')}
            >
              Computer Networks
            </button>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('os')}
            >
              Operating System
            </button>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('ds')}
            >
              Data Structures
            </button>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('dbms')}
            >
              DBMS
            </button>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('oops')}
            >
              OOPS
            </button>
            <button
              className='bg-transparent text-cyan-400 border-2 border-cyan-400 p-4 w-full h-16 text-lg md:text-xl hover:cursor-pointer hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out rounded-full shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 active:scale-95 font-bold'
              onClick={() => navigateToQuiz('web-dev')}
            >
              Web Development
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Quiz