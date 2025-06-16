import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizCard from './quiz/cards/QuizCard'; 

import cnquizData from '../data/cnquiz.json'; 
import osData from '../data/osquiz.json';
import dsData from '../data/dsquiz.json';
import dbmsData from '../data/dbmsquiz.json';
import oopsData from '../data/oopsquiz.json';
import webDevData from '../data/webdevquiz.json';

const quizDataMap = {
    'cnquiz': cnquizData,
    'os': osData,
    'ds': dsData,
    'dbms': dbmsData,
    'oops': oopsData,
    'web-dev': webDevData,
};

const DynamicQuiz = () => {
    const { subject } = useParams(); // Get the 'subject' parameter from the URL
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

    useEffect(() => {
        // Load the quiz data based on the subject parameter
        const data = quizDataMap[subject];
        if (data) {
            setCurrentQuiz(data);
            setCurrentQuestionIndex(0); // Reset for new quiz
            setSelectedOption(null);
            setScore(0);
            setQuizCompleted(false);
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
        } else {
            // Handle case where subject data is not found (e.g., redirect to 404 or error page)
            console.error(`Quiz data for subject "${subject}" not found.`);
            setCurrentQuiz(null);
        }
    }, [subject]); // Re-run effect when subject changes

    if (!currentQuiz) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-4'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4'></div>
                    <p className='text-xl sm:text-2xl'>Loading quiz...</p>
                    <p className='text-gray-400 mt-2'>Please wait while we prepare your quiz</p>
                </div>
            </div>
        );
    }

    const questions = currentQuiz.questions;
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (option) => {
        if (!isAnswerSubmitted) {
            setSelectedOption(option);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedOption === null) {
            alert("Please select an option before submitting.");
            return;
        }

        // Check if answer is correct
        const correct = selectedOption === currentQuestion.correct_option;
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);

        // Update score if correct
        if (correct) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        // Move to the next question or end the quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null); // Reset selected option for next question
            setIsAnswerSubmitted(false); // Reset submission state
            setIsAnswerCorrect(false); // Reset answer correctness
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setQuizCompleted(false);
        setIsAnswerSubmitted(false);
        setIsAnswerCorrect(false);
    };

    return (
        <div className='min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white'>
            {quizCompleted ? (
                <div className='flex flex-col items-center justify-center min-h-screen px-4 py-6'>
                    <div className='flex flex-col rounded-lg items-center justify-center w-full max-w-2xl bg-gray-800 shadow-2xl p-8 text-center'>
                        <div className='mb-6'>
                            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center'>
                                <span className='text-3xl'>🏆</span>
                            </div>
                            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-cyan-400'>
                                Quiz Completed!
                            </h2>
                        </div>
                        
                        <div className='space-y-4 mb-8'>
                            <p className='text-xl sm:text-2xl font-semibold'>
                                Your Score: <span className='text-cyan-400'>{score}</span> out of <span className='text-cyan-400'>{questions.length}</span>
                            </p>
                            <div className='flex items-center justify-center'>
                                <div className='w-32 h-32 relative'>
                                    <svg className='w-full h-full transform -rotate-90' viewBox='0 0 100 100'>
                                        <circle cx='50' cy='50' r='40' stroke='#374151' strokeWidth='8' fill='none' />
                                        <circle 
                                            cx='50' 
                                            cy='50' 
                                            r='40' 
                                            stroke='#06b6d4' 
                                            strokeWidth='8' 
                                            fill='none'
                                            strokeDasharray={`${(score / questions.length) * 251.2} 251.2`}
                                            className='transition-all duration-1000 ease-out'
                                        />
                                    </svg>
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className='text-2xl font-bold text-cyan-400'>
                                            {Math.round((score / questions.length) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className={`text-lg font-medium ${
                                (score / questions.length) >= 0.7 
                                    ? 'text-green-400' 
                                    : (score / questions.length) >= 0.5 
                                        ? 'text-yellow-400' 
                                        : 'text-red-400'
                            }`}>
                                {(score / questions.length) >= 0.7 
                                    ? 'Excellent work! 🎉' 
                                    : (score / questions.length) >= 0.5 
                                        ? 'Good effort! 👍' 
                                        : 'Keep practicing! 💪'}
                            </p>
                        </div>
                        
                        <button
                            onClick={handleRestartQuiz}
                            className='bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 text-lg sm:text-xl font-bold px-8 py-4 w-full rounded-full hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 ease-in-out active:scale-95 shadow-lg hover:shadow-xl'
                        >
                            Restart Quiz
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Compact Progress Info */}
                    <div className='flex items-center justify-center gap-6 py-3 text-sm sm:text-base'>
                        <span className='text-gray-300'>
                            Question <span className='font-bold text-cyan-400'>{currentQuestionIndex + 1}</span> of <span className='font-bold'>{questions.length}</span>
                        </span>
                        <span className='text-gray-300'>
                            Score: <span className='font-bold text-green-400'>{score}</span>
                        </span>
                    </div>
                    
                    <QuizCard
                        question={currentQuestion.question}
                        option1={currentQuestion.option1}
                        option2={currentQuestion.option2}
                        option3={currentQuestion.option3}
                        option4={currentQuestion.option4}
                        selectedOption={selectedOption}
                        correctOption={currentQuestion.correct_option}
                        handleOptionSelect={handleOptionSelect}
                        handleSubmitAnswer={handleSubmitAnswer}
                        handleNextQuestion={handleNextQuestion}
                        isAnswerSubmitted={isAnswerSubmitted}
                        isAnswerCorrect={isAnswerCorrect}
                    />
                </div>
            )}
        </div>
    );
};

export default DynamicQuiz; 