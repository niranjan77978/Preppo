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
  const getButtonStyle = (optionKey, optionIndex) => {
    // Define base colors for each option using static classes
    const baseColors = {
      1: 'bg-yellow-500 hover:bg-yellow-400',
      2: 'bg-blue-500 hover:bg-blue-400', 
      3: 'bg-purple-500 hover:bg-purple-400',
      4: 'bg-teal-500 hover:bg-teal-400'
    };
    
    const selectedColors = {
      1: 'bg-yellow-400 ring-4 ring-yellow-200',
      2: 'bg-blue-400 ring-4 ring-blue-200',
      3: 'bg-purple-400 ring-4 ring-purple-200', 
      4: 'bg-teal-400 ring-4 ring-teal-200'
    };
    
    // If answer hasn't been submitted yet, show normal selection state
    if (!isAnswerSubmitted) {
      return selectedOption === optionKey 
        ? `${selectedColors[optionIndex]} shadow-lg` 
        : `${baseColors[optionIndex]} hover:shadow-md`;
    }
    
    // After submission, show correct/incorrect feedback
    if (optionKey === correctOption) {
      // Correct answer - always green
      return 'bg-green-500 ring-4 ring-green-200 shadow-lg';
    } else if (optionKey === selectedOption && selectedOption !== correctOption) {
      // Wrong selected answer - red
      return 'bg-red-500 ring-4 ring-red-200 shadow-lg';
    } else {
      // Other unselected options - dimmed
      return 'bg-gray-500 opacity-60';
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
        <div className='flex flex-col gap-2 sm:gap-3 items-center justify-center w-full flex-1 px-6 py-3 overflow-y-auto'>
          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl p-3 sm:p-4 w-full hover:cursor-pointer  max-w-2xl rounded-full transition-all duration-300 ease-in-out active:scale-95 font-medium ${
              getButtonStyle('option1', 1)
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option1')}
            disabled={isAnswerSubmitted}
          >
            {option1}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl p-3 sm:p-4 w-full hover:cursor-pointer  max-w-2xl rounded-full transition-all duration-300 ease-in-out active:scale-95 font-medium ${
              getButtonStyle('option2', 2)
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option2')}
            disabled={isAnswerSubmitted}
          >
            {option2}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl p-3 sm:p-4 w-full hover:cursor-pointer  max-w-2xl rounded-full transition-all duration-300 ease-in-out active:scale-95 font-medium ${
              getButtonStyle('option3', 3)
            }`}
            onClick={() => !isAnswerSubmitted && handleOptionSelect('option3')}
            disabled={isAnswerSubmitted}
          >
            {option3}
          </button>

          <button 
            className={`text-sm sm:text-base md:text-lg lg:text-xl p-3 sm:p-4 w-full hover:cursor-pointer  max-w-2xl rounded-full transition-all duration-300 ease-in-out active:scale-95 font-medium ${
              getButtonStyle('option4', 4)
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
            className='bg-transparent text-cyan-400 text-xs sm:text-sm md:text-base hover:cursor-pointer  lg:text-lg font-bold px-4 py-2 rounded-full border-2 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 ease-in-out active:scale-95 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed'
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