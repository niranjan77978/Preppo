import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/common/Footer';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Create floating code elements
    const elements = [
      { id: 1, symbol: '{...}', delay: 0 },
      { id: 2, symbol: '<div>', delay: 0.5 },
      { id: 3, symbol: 'const', delay: 1 },
      { id: 4, symbol: '=>', delay: 1.5 },
      { id: 5, symbol: '[]', delay: 2 },
      { id: 6, symbol: 'function', delay: 2.5 },
    ];
    setFloatingElements(elements);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden pb-8"
      onMouseMove={handleMouseMove}
    >
      {/* Floating code elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute text-blue-300 text-xl font-mono opacity-30 pointer-events-none animate-bounce"
          style={{
            left: `${10 + (element.id * 15)}%`,
            top: `${20 + (element.id * 8)}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: '3s',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          {element.symbol}  
        </div>
      ))}

      {/* Main content */}
      <div className="flex flex-col items-center justify-start min-h-screen relative z-10 px-4 pt-8">
        {/* Hero section with enhanced animations */}
        <div 
          className={`text-center mb-8 mt-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-6 animate-pulse"
            style={{ fontFamily: 'Iceberg' }}>
            Welcome to Preppo
          </h1>
          
          <div className="relative">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 max-w-2xl mx-auto leading-relaxed px-4">
              Your one-stop solution for learning and mastering CS concepts.
            </p>
            
            {/* Animated underline */}
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Interactive feature cards */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 px-4 w-full max-w-4xl transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Link 
            to="/courses"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:rotate-1 block"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">📚</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Interactive Learning</h3>
            <p className="text-gray-300 text-sm md:text-base">Dive into hands-on coding exercises with real-time feedback</p>
          </Link>
          
          <Link 
            to="/quiz"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-rotate-1 block"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">🧠</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Smart Quizzes</h3>
            <p className="text-gray-300 text-sm md:text-base">Test your knowledge with adaptive quizzes that level up</p>
          </Link>
        </div>

        {/* Enhanced action buttons
        <div 
          className={`flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 md:mb-16 px-4 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Link 
            to="/courses"
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 block text-center"
          >
            <span className="relative z-10">Explore Courses</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          </Link>
          
          <Link 
            to="/quiz"
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25 block text-center"
          >
            <span className="relative z-10">Take a Quiz</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
          </Link>
        </div> */}

        {/* Scroll indicator */}
        <div className="mt-auto mb-8 flex justify-center animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Home;