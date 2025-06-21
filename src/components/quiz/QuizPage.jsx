import React from 'react'
import QuizCard from './cards/QuizCard'

const CnQuiz = () => {
  return (
    <>
      <div className='flex flex-col items-center  md:justify-start min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white'>
        <QuizCard />
      </div>
    </>
  )
}

export default CnQuiz