import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Brain, User, LogOut, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom'; 

const Navbar = ({ onOpenAuthDialog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      // Check our in-memory auth data
      const authData = window.authData;
      
      if (authData && authData.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(authData.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-6 w-6" /> },
    { name: 'Quiz', path: '/quiz', icon: <Brain className="h-6 w-6" /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen className="h-6 w-6" /> }
  ];

  const handleLogout = () => {
    // Clear authentication data from memory
    window.authData = null;
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileMenu(false);
    
    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Redirect to home page
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      // Open auth dialog
      if (onOpenAuthDialog) {
        onOpenAuthDialog();
      }
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600 transition-colors duration-200 shadow-lg"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
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
            <Link 
              to="/" 
              className={`font-bold text-white hover:text-gray-400 transition-colors duration-200 ${isCollapsed ? 'text-lg' : 'text-xl'}`}
              style={{fontFamily: 'Sansita Swashed'}}
            >
              {isCollapsed ? 'P' : 'Preppo'} 
            </Link>
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
                  {isCollapsed && (
                  <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {item.name}
                  </div>
                  )}
                </Link>
                );
            })}
          </div>
          
          {/* Profile Section */}
          <div className="px-2 py-4 border-t border-gray-700 relative">
            <div 
              className={`flex items-center cursor-pointer hover:bg-gray-700 rounded-lg transition-all duration-300 ${
                isCollapsed ? 'md:justify-center md:p-2 px-4 py-2' : 'px-4 py-2'
              }`}
              onClick={handleProfileClick}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {isAuthenticated && user ? (
                  <span className="text-white text-sm font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`text-white ml-3 transition-all duration-300 ${
                isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden opacity-100' : 'opacity-100'
              }`}>
                {isAuthenticated && user ? (
                  <>
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-300">{user.email || 'Student'}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">Sign In</p>
                    <p className="text-xs text-gray-300">Get started</p>
                  </>
                )}
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && isAuthenticated && !isCollapsed && (
              <div className="absolute bottom-full left-2 right-2 mb-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsOpen(false);
                    // Navigate to profile page or open profile dialog
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsOpen(false);
                    // Navigate to settings page
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {isAuthenticated ? 'Profile' : 'Sign In'}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content spacer */}
      <div className={`flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'hidden md:block md:w-16' : 'hidden md:block md:w-48'
      }`}></div>
    </>
  );
};

export default Navbar;