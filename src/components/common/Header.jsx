import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, UserCircle, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onOpenAuthDialog }) => {
  // Safely handle undefined useAuth()
  const auth = useAuth() || {};
  const { currentUser, userData, logout } = auth;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Close menus when clicking outside
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

  // Initialize dark mode
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [darkMode]);

  // const toggleDarkMode = () => {
  //   setDarkMode((prev) => {
  //     const newMode = !prev;
  //     if (newMode) {
  //       document.documentElement.classList.add('dark');
  //     } else {
  //       document.documentElement.classList.remove('dark');
  //     }
  //     return newMode;
  //   });
  // };

  const handleProfileClick = () => {
    if (!currentUser) {
      // Open auth dialog for non-authenticated users
      if (onOpenAuthDialog) {
        onOpenAuthDialog();
      }
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      // Optional: Show success message or redirect
    } catch (error) {
      console.error('Logout error:', error);
      // Optional: Show error message to user
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
    setShowProfileMenu(false);
  };

  // Helper to get the first name
  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : 'User';
  };

  return (
    <div className='flex bg-gray-900 h-20 text-white p-4 w-full text-2xl font-bold relative border-b border-gray-700'>
      {/* Logo */}
      <a 
        href="/" 
        className='hover:text-gray-200 ml-11 transition-colors duration-200' 
        style={{fontFamily:"Sansita Swashed"}}
      >
        Preppo
      </a>
      
      <div className="flex items-center ml-auto gap-4">
        {/* Dark Mode Toggle  */}
        {/* <button
          className='flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full transition-all duration-200 hover:scale-105'
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button> */}

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          {currentUser && userData ? (
            /* Authenticated User Profile */
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105"
              onClick={handleProfileClick}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-gray-600 hover:ring-blue-500 transition-all duration-200">
                <span className="text-white text-sm font-semibold">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-white">{getFirstName(userData.name)}</p>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
          ) : (
            /* Sign In Button */
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium shadow-lg"
            >
              <UserCircle className='w-5 h-5' />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Profile Dropdown Menu */}
          {showProfileMenu && currentUser && userData && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{getFirstName(userData.name)}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <div className="border-t border-gray-600 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
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