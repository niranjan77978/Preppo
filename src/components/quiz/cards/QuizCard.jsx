import React, { useState } from 'react'

const QuizCard = ({
  question,
  option1,
  option2,
  option3,
  option4,
  selectedOption,
  correctOption,
  handleOptionSelect,
  handleSubmitAnswer,
  handleNextQuestion,
  isAnswerSubmitted,
  isAnswerCorrect
}) => {
  
  // Function to get button styling based on state
  const getButtonStyle = (optionKey) => {
    // If answer hasn't been submitted yet, show normal selection state
    if (!isAnswerSubmitted) {
      return selectedOption === optionKey 
        ? 'text-gray-900 bg-cyan-400 border-cyan-400 shadow-cyan-400/60 shadow-lg transform scale-105' 
        : 'bg-transparent text-cyan-400 border-cyan-400 shadow-cyan-400/20 hover:bg-cyan-400 hover:shadow-cyan-400/40 hover:text-gray-900';
    }
    
    // After submission, show correct/incorrect feedback
    if (optionKey === correctOption) {
      // Correct answer - always green
      return 'text-gray-900 bg-green-400 border-green-400 shadow-green-400/60 shadow-lg transform scale-105';
    } else if (optionKey === selectedOption && selectedOption !== correctOption) {
      // Wrong selected answer - red
      return 'text-gray-900 bg-red-400 border-red-400 shadow-red-400/60 shadow-lg transform scale-105';
    } else {
      // Other unselected options - dimmed
      return 'text-gray-500 border-gray-500 bg-transparent opacity-50';
    }
  };

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-4 pt-8 pb-4'>
      <div 
        style={{ fontFamily: "Gilroy, sans-serif" }} 
        className='flex flex-col rounded-lg items-center justify-between w-full max-w-4xl bg-gray-800 shadow-2xl text-white h-[75vh] overflow-hidden'
      >
        {/* Question Section */}
        <div className='flex flex-col items-center justify-center w-full px-6 py-4 border-b border-gray-600'>
          <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-serif text-center leading-relaxed'>
            {question}
          </h1>
        </div>
        
        {/* Options Section */}
        <div className='flex flex-col gap-3 sm:gap-4 items-center justify-center w-full flex-1 px-6 py-4 overflow-y-auto'>
          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold px-6 py-3 sm:py-4 w-full hover:cursor-pointer max-w-2xl rounded-full border-2 transition-all duration-300 ease-in-out active:scale-95 shadow-sm ${
              getButtonStyle('option1')
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option1')}
            disabled={isAnswerSubmitted}
          >
            {option1}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold px-6 py-3 sm:py-4 w-full hover:cursor-pointer max-w-2xl rounded-full border-2 transition-all duration-300 ease-in-out active:scale-95 shadow-sm ${
              getButtonStyle('option2')
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option2')}
            disabled={isAnswerSubmitted}
          >
            {option2}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold px-6 py-3 sm:py-4 w-full hover:cursor-pointer max-w-2xl rounded-full border-2 transition-all duration-300 ease-in-out active:scale-95 shadow-sm ${
              getButtonStyle('option3')
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option3')}
            disabled={isAnswerSubmitted}
          >
            {option3}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold px-6 py-3 sm:py-4 w-full hover:cursor-pointer max-w-2xl rounded-full border-2 transition-all duration-300 ease-in-out active:scale-95 shadow-sm ${
              getButtonStyle('option4')
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option4')}
            disabled={isAnswerSubmitted}
          >
            {option4}
          </button>
        </div>

        {/* Action Buttons Section */}
        <div className='flex items-center justify-center w-full px-6 py-3 border-t border-gray-600'>
          {/* Submit/Next button */}
          <button 
            className='bg-transparent text-cyan-400 text-xs sm:text-sm md:text-base hover:cursor-pointer lg:text-lg font-bold px-6 py-3 rounded-full border-2 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out active:scale-95 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={!isAnswerSubmitted ? handleSubmitAnswer : handleNextQuestion}
            disabled={!isAnswerSubmitted && !selectedOption}
          >
            {!isAnswerSubmitted ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizCard