import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, UserCircle, User, LogOut, Settings, ChevronDown } from 'lucide-react';

const Header = ({ onOpenAuthDialog }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      // Check our in-memory auth data (same as Navbar)
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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      // Open auth dialog instead of navigating
      if (onOpenAuthDialog) {
        onOpenAuthDialog();
      }
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  const handleLogout = () => {
    // Clear authentication data from memory (same as Navbar)
    window.authData = null;
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileMenu(false);
    
    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Redirect to home page
    window.location.href = '/';
  };

  const navigateTo = (path) => {
    window.location.href = path;
    setShowProfileMenu(false);
  };

  return (  
    <div className='flex bg-gray-900 h-20 text-white p-4 w-full text-2xl font-bold relative'>
      <a href="/" className='hover:text-gray-200 ml-11' style={{fontFamily:"Sansita Swashed"}}>
        Preppo
      </a>
      
      <div className="flex items-center ml-auto gap-6">
        {/* Dark Mode Toggle - Currently commented out */}
        {/* <button
          className='flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 rounded-full transition-colors duration-200'
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button> */}

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          {isAuthenticated && user ? (
            /* Authenticated User Profile */
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200"
              onClick={handleProfileClick}
            >
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user.name || 'User'}</p>
                <p className="text-xs text-gray-300 font-normal">{user.email}</p>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
          ) : (
            /* Sign In Button */
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
            >
              <UserCircle className='w-5 h-5' />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {showProfileMenu && isAuthenticated && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-600">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-300">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => navigateTo('/profile')}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </button>
                
                <button
                  onClick={() => navigateTo('/settings')}
                  className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                
                <div className="border-t border-gray-600 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;