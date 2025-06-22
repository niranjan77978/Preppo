import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizCard from './quiz/cards/QuizCard'; 
import cnquizData from '../quizData/cnquiz.json'; 
import osData from '../quizData/osquiz.json';
import dsData from '../quizData/dsquiz.json';
import dbmsData from '../quizData/dbmsquiz.json';
import oopsData from '../quizData/oopsquiz.json';
import webDevData from '../quizData/webdevquiz.json';

// Fix the import to match the actual export in firebase.js
import * as firebaseUtils from '../firebase';
import { getAuth } from "firebase/auth";

const quizDataMap = {
    'cnquiz': cnquizData,
    'os': osData,
    'ds': dsData,
    'dbms': dbmsData,
    'oops': oopsData,
    'web-dev': webDevData,
};

const DynamicQuiz = () => {
    const { subject, quizNumber } = useParams(); // Get both subject and quizNumber
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
        if (data && quizNumber) {
            const quizNum = parseInt(quizNumber);
            
            // Calculate the start and end indices for the current quiz
            // Quiz 1: questions 0-19, Quiz 2: questions 20-39, etc.
            const startIndex = (quizNum - 1) * 20;
            const endIndex = quizNum * 20;
            
            // Extract the specific 20 questions for this quiz
            const quizQuestions = data.questions.slice(startIndex, endIndex);
            
            // Create a new quiz object with only the selected questions
            const currentQuizData = {
                ...data,
                quiz_title: `${data.quiz_title} - Quiz ${quizNum}`,
                total_questions: 20,
                questions: quizQuestions
            };
            
            setCurrentQuiz(currentQuizData);
            setCurrentQuestionIndex(0); // Reset for new quiz
            setSelectedOption(null);
            setScore(0);
            setQuizCompleted(false);
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
        } else {
            // Handle case where subject data is not found
            console.error(`Quiz data for subject "${subject}" or quiz number "${quizNumber}" not found.`);
            setCurrentQuiz(null);
        }
    }, [subject, quizNumber]); // Re-run effect when subject or quizNumber changes

    // Save progress to Firestore after quiz completion
    useEffect(() => {
        if (quizCompleted && currentQuiz) {
            let user = null;
            try {
                const auth = getAuth();
                user = auth.currentUser;
            } catch (e) {
                user = null;
            }
            if (user && typeof firebaseUtils.saveQuizProgress === "function") {
                const quizId = `${subject}-quiz${quizNumber}`;
                const progressData = {
                    score,
                    total: currentQuiz.questions.length,
                    completedAt: new Date().toISOString()
                };
                firebaseUtils.saveQuizProgress(user.uid, quizId, progressData)
                  .catch((err) => {
                    console.error("Failed to save quiz progress:", err);
                  });
            }
        }
    }, [quizCompleted, currentQuiz, score, subject, quizNumber]);

    if (!currentQuiz) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Loading Quiz...</h2>
                    <p className="text-gray-300">Please wait while we prepare your quiz</p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {quizCompleted ? (
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-lg">
                                    🏆
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    Quiz Completed!
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    {currentQuiz.quiz_title}
                                </p>
                            </div>
                            
                            <div className="mb-8">
                                <div className="text-2xl font-bold text-white mb-4">
                                    Your Score: {score} out of {questions.length}
                                </div>
                                <div className="relative w-12 h-12 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-gray-600"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-blue-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeDasharray={`${(score / questions.length) * 100}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">
                                            {Math.round((score / questions.length) * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-lg font-semibold ${
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
                            
                            <div className="space-y-3">
                                <button
                                    onClick={handleRestartQuiz}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Restart This Quiz
                                </button>
                                <button
                                    onClick={() => window.history.back()}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Back to Quiz Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4">
                    {/* Compact Progress Info */}
                    <div className="flex justify-between items-center mb-4 bg-gray-800 rounded-lg p-2 mx-auto max-w-4xl border border-gray-700">
                        <div className="text-white font-medium text-sm">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <div className="text-white font-medium text-sm">
                            Score: {score}
                        </div>
                        <div className="text-gray-300 text-xs">
                            {currentQuiz.quiz_title}
                        </div>
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