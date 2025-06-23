import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import QuizCard from './quiz/cards/QuizCard'; 
import cnquizData from '../quizData/cnquiz.json'; 
import osData from '../quizData/osquiz.json';
import dsData from '../quizData/dsquiz.json';
import dbmsData from '../quizData/dbmsquiz.json';
import oopsData from '../quizData/oopsquiz.json';
import webDevData from '../quizData/webdevquiz.json';

// Fix: support both 'cnquiz' and 'networks' as keys for CN quiz
const quizDataMap = {
    'cnquiz': cnquizData,
    // 'networks': cnquizData,
    'os': osData,
    'ds': dsData,
    'dbms': dbmsData,
    'oops': oopsData,
    'web-dev': webDevData,
};

const DynamicQuiz = () => {
    const { subject, quizNumber } = useParams();
    const { currentUser, updateQuizProgress, getQuizProgress, isQuizCompleted } = useAuth(); // Use AuthContext
    
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    // Add a ref to track if quiz has been initialized to prevent resets
    const quizInitialized = useRef(false);
    const quizCompletedPersistent = useRef(false);

    // Generate quiz ID for Firebase storage
    const quizId = `${subject}-quiz${quizNumber}`;

    // FIXED: Separate quiz loading from quiz state management
    useEffect(() => {
        // Only load quiz data, don't reset state if already initialized
        let data = quizDataMap[subject];
        if (!data && subject === 'networks') data = quizDataMap['cnquiz'];
        if (!data && subject === 'cnquiz') data = quizDataMap['networks'];
        
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
            
            // Only reset quiz state on initial load, not on subsequent re-renders
            if (!quizInitialized.current && !quizCompletedPersistent.current) {
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setScore(0);
                setQuizCompleted(false);
                setIsAnswerSubmitted(false);
                setIsAnswerCorrect(false);
                quizInitialized.current = true;
                
                // Check if user has previous progress on this quiz
                if (currentUser) {
                    const previousProgress = getQuizProgress(quizId);
                    if (previousProgress) {
                        console.log(`Previous attempt found for ${quizId}:`, previousProgress);
                    }
                }
            }
        } else {
            // Handle case where subject data is not found
            console.error(`Quiz data for subject "${subject}" or quiz number "${quizNumber}" not found.`);
            setCurrentQuiz(null);
        }
    }, [subject, quizNumber]); // FIXED: Removed currentUser and other auth-related dependencies

    // FIXED: Separate effect for auth-related operations that don't reset quiz state
    useEffect(() => {
        if (currentUser && currentQuiz && quizInitialized.current && !quizCompletedPersistent.current) {
            const previousProgress = getQuizProgress(quizId);
            if (previousProgress) {
                console.log(`Previous attempt found for ${quizId}:`, previousProgress);
            }
        }
    }, [currentUser, getQuizProgress, quizId, currentQuiz]);

    // Save progress to Firebase after quiz completion
    const saveQuizToFirebase = async (finalScore) => {
        if (!currentUser) {
            setShowLoginPrompt(true);
            return;
        }

        if (!currentQuiz) return;

        try {
            const progressData = {
                score: finalScore,
                total: currentQuiz.questions.length,
                percentage: Math.round((finalScore / currentQuiz.questions.length) * 100),
                subject: subject,
                quizNumber: parseInt(quizNumber),
                quizTitle: currentQuiz.quiz_title
            };

            await updateQuizProgress(quizId, progressData);
            console.log('Quiz progress saved successfully to Firebase');
        } catch (error) {
            console.error('Failed to save quiz progress to Firebase:', error);
            // You might want to show an error message to the user here
        }
    };

    // Handle quiz completion - FIXED: Prevent multiple saves and resets
    useEffect(() => {
        if (quizCompleted && currentQuiz && !quizCompletedPersistent.current) {
            quizCompletedPersistent.current = true; // Mark as persistently completed
            saveQuizToFirebase(score);
        }
    }, [quizCompleted, score, currentQuiz]);

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

    // FIXED: Reset all refs when restarting quiz
    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setQuizCompleted(false);
        setIsAnswerSubmitted(false);
        setIsAnswerCorrect(false);
        
        // Reset refs to allow proper restart
        quizInitialized.current = false;
        quizCompletedPersistent.current = false;
    };

    // Get performance message and color
    const getPerformanceMessage = (percentage) => {
        if (percentage >= 80) return { message: 'Excellent work! 🎉', color: 'text-green-400' };
        if (percentage >= 70) return { message: 'Great job! 👍', color: 'text-green-400' };
        if (percentage >= 60) return { message: 'Good effort! 👍', color: 'text-yellow-400' };
        if (percentage >= 50) return { message: 'Keep practicing! 📚', color: 'text-yellow-400' };
        return { message: 'More practice needed! 💪', color: 'text-red-400' };
    };

    const percentage = Math.round((score / questions.length) * 100);
    const performance = getPerformanceMessage(percentage);
    const isAlreadyCompleted = currentUser ? isQuizCompleted(quizId) : false;
    const previousProgress = currentUser ? getQuizProgress(quizId) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-gray-700">
                        <h3 className="text-2xl font-bold text-white mb-4">Save Your Progress</h3>
                        <p className="text-gray-300 mb-6">
                            Login to save your quiz scores and track your progress across all subjects!
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Continue Without Saving
                            </button>
                            <button
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    // You can trigger the auth dialog here
                                    // This depends on your auth implementation
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                <div className="relative w-16 h-16 mx-auto mb-4">
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
                                            strokeDasharray={`${percentage}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-lg font-semibold ${performance.color}`}>
                                    {performance.message}
                                </p>

                                {/* Previous attempt info */}
                                {currentUser && previousProgress && (
                                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-300">
                                            Previous best: {previousProgress.bestScore || previousProgress.score}/{previousProgress.total} 
                                            ({Math.round(((previousProgress.bestScore || previousProgress.score) / previousProgress.total) * 100)}%)
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Attempts: {previousProgress.attempts || 1}
                                        </p>
                                    </div>
                                )}

                                {/* Progress saved confirmation */}
                                {currentUser && (
                                    <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                                        <p className="text-sm text-green-300">
                                            ✅ Progress saved to your account
                                        </p>
                                    </div>
                                )}
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
                    <div className="flex justify-between items-center mb-4 bg-gray-800 rounded-lg p-3 mx-auto max-w-4xl border border-gray-700">
                        <div className="text-white font-medium text-sm">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <div className="text-white font-medium text-sm">
                            Score: {score}
                        </div>
                        <div className="text-gray-300 text-xs">
                            {currentQuiz.quiz_title}
                        </div>
                        {/* Show completion status */}
                        {currentUser && isAlreadyCompleted && (
                            <div className="text-green-400 text-xs">
                                ✓ Completed
                            </div>
                        )}
                    </div>

                    {/* Previous attempt indicator */}
                    {currentUser && previousProgress && (
                        <div className="mb-4 mx-auto max-w-4xl">
                            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-2 text-center">
                                <p className="text-blue-300 text-sm">
                                    📊 Previous best: {previousProgress.bestScore || previousProgress.score}/{previousProgress.total} 
                                    ({Math.round(((previousProgress.bestScore || previousProgress.score) / previousProgress.total) * 100)}%)
                                </p>
                            </div>
                        </div>
                    )}
                    
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
