import React from 'react'

const QuizCard = ({
  question = "What is the primary purpose of a router in a computer network?",
  option1 = "To connect multiple networks and route data between them",
  option2 = "To store and manage data in a database",
  option3 = "To provide a user interface for network management",
  option4 = "To encrypt data for secure transmission",

}) => {
  return (
    <>
      <div style={{ fontFamily: "Gilroy, Sans " }} className='flex flex-col rounded-lg items-center border justify-center h-[80%] w-[70%] bg-gray-800 shadow-lg p-4 m-2  text-white  md:mt-[5%]'>
        <div className='flex flex-col items-center justify-center h-full w-full border-b '>
          {/* question */}
          <h1 className='text-xl mt-4 m-2 font-bold font-serif shadow-2xl mb-6'>{question}</h1>
        </div>
        {/* buttons */}
        <div className='flex flex-col gap-6 items-center justify-center h-full w-[80%]  m-4 p-2'>
          <button className='bg-yellow-500 text-xl p-3 w-[80%] rounded-full hover:bg-yellow-400 transition-all duration-300 ease-in-out active:scale-93'>{option1} </button>

          <button className='bg-blue-600 text-xl p-3 w-[80%] rounded-full hover:bg-blue-400 transition-all duration-300 ease-in-out active:scale-93'>{option2}</button>

          <button className='bg-purple-600 text-xl p-3 w-[80%] rounded-full hover:bg-purple-500 transition-all duration-300 ease-in-out active:scale-93'>{option3}</button>

          <button className='bg-teal-600 text-xl p-3 w-[80%] rounded-full hover:bg-teal-500 transition-all duration-300 ease-in-out active:scale-93 '>{option4}</button>

          <div className='flex  items-start justify-between w-[80%] mt-4'>
            {/* submit button */}
            <button style={{ fontFamily: "" }} className='bg-transparent mt-3 mr-0 text-cyan-400 text-xl font-bold p-3 pl-8 pr-8 rounded-full border-2 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out active:scale-95 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40'>Submit</button>

            {/* next button */}
            <button style={{ fontFamily: "" }} className='bg-transparent mt-3 mr-0 text-cyan-400 text-xl font-bold p-3 pl-8 pr-8 rounded-full border-2 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out active:scale-95 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40'>Next</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuizCard