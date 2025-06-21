import React, { useState } from 'react';
import { Home, BookOpen, Brain} from 'lucide-react';
import { useLocation } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation(); // Get current route

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-6 w-6" /> },
    { name: 'Quiz', path: '/quiz', icon: <Brain className="h-6 w-6" /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen className="h-6 w-6" /> }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600 transition-colors duration-200 shadow-lg"
        >
          <span className="sr-only">Open sidebar</span>
          {/* Hamburger icon */}
          <svg
            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Close icon */}
          <svg
            className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Desktop collapse button */}
      <div className={`hidden md:block fixed top-4 z-50 transition-all duration-300 ${
        isCollapsed ? 'left-4' : 'left-4'
      }`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center justify-center p-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600 transition-all duration-300 shadow-lg"
        >
          <span className="sr-only">Toggle sidebar</span>
          {/* Three lines icon */}
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile - removed to fix black background issue */}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-gray-800 to-gray-950 shadow-2xl z-40 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        md:translate-x-0
        ${isCollapsed ? 'md:w-16' : 'md:w-48'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`flex items-center justify-center h-20 bg-gray-800 border-b border-gray-700 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            <a 
              href="/" 
              className={`font-bold text-white hover:text-gray-400 transition-colors duration-200 ${isCollapsed ? 'text-lg' : 'text-xl'}`}
            >
              {isCollapsed ? '' : ''} 
            </a>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 px-2 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
                return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center rounded-lg group relative transition-all duration-200
                  ${isCollapsed ? 'md:justify-center md:p-3 px-4 py-3' : 'px-4 py-3'}
                  ${isActive
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'text-white hover:bg-gray-700 hover:bg-opacity-80'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <span className={`text-xl transition-transform duration-200
                  ${isCollapsed ? 'md:mr-0' : 'mr-3'}
                  ${isActive ? 'text-yellow-300 scale-110' : 'group-hover:scale-110'}
                  `}>
                  {item.icon}
                  </span>
                  <span className={`font-medium transition-all duration-300
                  ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden opacity-100' : 'opacity-100'}
                  ${isActive ? 'text-yellow-300' : ''}
                  `}>
                  {item.name}
                  </span>
                  {/* Tooltip for collapsed state - only show on desktop */}
                  {isCollapsed && (
                  <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {item.name}
                  </div>
                  )}
                </Link>
                );
            })}
          </div>
          
          {/* Footer Section */}
          <div className="px-2 py-4 border-t border-gray-700">
            <div className={`flex items-center transition-all duration-300 ${
              isCollapsed ? 'md:justify-center md:p-2 px-4 py-2' : 'px-4 py-2'
            }`}>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              <div className={`text-white ml-3 transition-all duration-300 ${
                isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden opacity-100' : 'opacity-100'
              }`}>
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-gray-300">Student</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content spacer - this pushes content to the right */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'hidden md:block md:w-16' : 'hidden md:block md:w-48'
      }`}></div>
    </>
  );
};

export default Navbar;