import React from 'react'
import { useNavigate } from 'react-router-dom'

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
              className='bg-purple-800 p-4 w-full h-16 text-lg md:text-xl hover:bg-purple-600 transition-all duration-300 ease-in-out rounded-2xl'
              onClick={() => navigateToQuiz('cnquiz')}
            >
              Computer Networks
            </button>
            <button 
              className='bg-red-600 p-4 w-full h-16 text-lg md:text-xl hover:bg-red-500 transition-all duration-300 ease-in-out rounded-2xl' 
              onClick={() => navigateToQuiz('os')}
            >
              Operating System
            </button>
            <button 
              className='bg-indigo-700 p-4 w-full h-16 text-lg md:text-xl hover:bg-indigo-500 transition-all duration-300 ease-in-out rounded-2xl' 
              onClick={() => navigateToQuiz('ds')}
            >
              Data Structures
            </button>
            <button 
              className='bg-green-800 p-4 w-full h-16 text-lg md:text-xl hover:bg-green-600 transition-all duration-300 ease-in-out rounded-2xl' 
              onClick={() => navigateToQuiz('dbms')}
            >
              DBMS
            </button>
            <button 
              className='bg-yellow-400 p-4 w-full h-16 text-lg md:text-xl hover:bg-yellow-300 transition-all duration-300 ease-in-out rounded-2xl text-black'
              onClick={() => navigateToQuiz('oops')}
            >
              OOPS
            </button>
            <button 
              className='bg-amber-700 p-4 w-full h-16 text-lg md:text-xl hover:bg-amber-500 transition-all duration-300 ease-in-out rounded-2xl' 
              onClick={() => navigateToQuiz('web-dev')}
            >
              Web Development
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Quiz