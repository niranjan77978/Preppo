import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AllQuizzes = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  // Subject display names mapping
  const subjectNames = {
    'cnquiz': 'Computer Networks',
    'os': 'Operating Systems',
    'ds': 'Data Structures',
    'dbms': 'Database Management Systems',
    'oops': 'Object-Oriented Programming',
    'web-dev': 'Web Development'
  };

  const navigateToQuiz = (quizNumber) => {
    navigate(`/quiz/${subject}/${quizNumber}`);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'cnquiz': 'from-blue-500 to-blue-700',
      'os': 'from-green-500 to-green-700',
      'ds': 'from-purple-500 to-purple-700',
      'dbms': 'from-red-500 to-red-700',
      'oops': 'from-yellow-500 to-yellow-700',
      'web-dev': 'from-pink-500 to-pink-700'
    };
    return colors[subject] || 'from-gray-500 to-gray-700';
  };

  const getQuizIcon = (quizNumber) => {
    const icons = ['📚', '🧠', '⚡', '🎯', '🏆'];
    return icons[quizNumber - 1] || '📝';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${getSubjectColor(subject)} mb-4 sm:mb-6 shadow-2xl`}>
            <span className="text-2xl sm:text-3xl">
              {subject === 'cnquiz' && '🌐'}
              {subject === 'os' && '💻'}
              {subject === 'ds' && '🔗'}
              {subject === 'dbms' && '🗄️'}
              {subject === 'oops' && '🔧'}
              {subject === 'web-dev' && '🌍'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {subjectNames[subject] || subject.toUpperCase()}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Master your knowledge with our comprehensive quiz series. Each quiz contains 20 carefully selected questions.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>5 Quizzes Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>20 Questions Each</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>100 Total Questions</span>
            </div>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5].map((quizNumber) => (
            <div
              key={quizNumber}
              onClick={() => navigateToQuiz(quizNumber)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-3xl">
                {/* Quiz Icon */}
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${getSubjectColor(subject)} shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                    <span className="text-lg sm:text-2xl">{getQuizIcon(quizNumber)}</span>
                  </div>
                </div>

                {/* Quiz Title */}
                <h3 className="text-lg sm:text-xl font-bold text-center mb-3 group-hover:text-white transition-colors duration-300">
                  Quiz {quizNumber}
                </h3>

                {/* Quiz Info */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                  <div className="flex justify-between items-center">
                    <span>Questions:</span>
                    <span className="font-semibold text-white">20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Difficulty:</span>
                    <span className="font-semibold text-yellow-400">
                      {quizNumber <= 2 ? 'Medium' : quizNumber <= 4 ? 'Hard' : 'Hard'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getSubjectColor(subject)} transition-all duration-500 group-hover:w-full`}
                    style={{ width: '0%' }}
                  ></div>
                </div>

                {/* Start Button */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                    Start Quiz
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 text-center">
            <div className="text-2xl sm:text-3xl mb-2">📊</div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">Track Progress</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Monitor your learning journey across all quizzes</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 text-center">
            <div className="text-2xl sm:text-3xl mb-2">⏱️</div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">Timed Practice</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Challenge yourself with time-based learning</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700 text-center">
            <div className="text-2xl sm:text-3xl mb-2">🎖️</div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">Earn Achievements</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Unlock badges as you complete quizzes</p>
          </div>
        </div> */}

        {/* Back Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => navigate('/quiz')}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Subjects
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllQuizzes;