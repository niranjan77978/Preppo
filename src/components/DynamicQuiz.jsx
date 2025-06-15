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

    useEffect(() => {
        // Load the quiz data based on the subject parameter
        const data = quizDataMap[subject];
        if (data) {
            setCurrentQuiz(data);
            setCurrentQuestionIndex(0); // Reset for new quiz
            setSelectedOption(null);
            setScore(0);
            setQuizCompleted(false);
        } else {
            // Handle case where subject data is not found (e.g., redirect to 404 or error page)
            console.error(`Quiz data for subject "${subject}" not found.`);
            setCurrentQuiz(null);
        }
    }, [subject]); // Re-run effect when subject changes

    if (!currentQuiz) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white'>
                <p className='text-2xl'>Loading quiz or quiz not found...</p>
            </div>
        );
    }

    const questions = currentQuiz.questions;
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleSubmitAnswer = () => {
        if (selectedOption === null) {
            alert("Please select an option before submitting.");
            return;
        }

        if (selectedOption === currentQuestion.correct_option) {
            setScore(prevScore => prevScore + 1);
        }

        // Move to the next question or end the quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedOption(null); // Reset selected option for next question
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setQuizCompleted(false);
    };


    return (
        <div className='flex flex-col items-center md:justify-start min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white'>
            {quizCompleted ? (
                <div className='flex flex-col rounded-lg items-center justify-center h-[80%] w-[70%] bg-gray-800 shadow-lg p-4 m-2 text-white md:mt-[5%]'>
                    <h2 className='text-3xl font-bold mb-4'>Quiz Completed!</h2>
                    <p className='text-xl'>Your score: {score} out of {questions.length}</p>
                    <button
                        onClick={handleRestartQuiz}
                        className='bg-cyan-400 mt-6 text-gray-900 text-xl font-bold p-4 w-[80%] rounded-full border-2 border-cyan-400 hover:bg-cyan-300 transition-all duration-300 ease-in-out active:scale-95 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40'
                    >
                        Restart Quiz
                    </button>
                </div>
            ) : (
                <>
                    <h1 className='text-2xl md:text-4xl font-extrabold mt-8 mb-4'>{currentQuiz.quiz_title}</h1>
                    <p className='text-gray-300 text-sm'>Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <QuizCard
                        question={currentQuestion.question}
                        option1={currentQuestion.option1}
                        option2={currentQuestion.option2}
                        option3={currentQuestion.option3}
                        option4={currentQuestion.option4}
                        selectedOption={selectedOption}
                        handleOptionSelect={handleOptionSelect}
                        handleSubmitAnswer={handleSubmitAnswer}
                    />
                </>
            )}
        </div>
    );
};

export default DynamicQuiz;