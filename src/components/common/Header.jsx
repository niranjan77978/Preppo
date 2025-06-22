import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, UserCircle, User, LogOut, Settings, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onOpenAuthDialog }) => {
  // Safely handle undefined useAuth()
  const auth = useAuth() || {};
  const { currentUser, userData, logout } = auth;

  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

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

  const handleNotificationClick = () => {
    if (!currentUser) {
      // Prompt to sign in for notifications
      if (onOpenAuthDialog) {
        onOpenAuthDialog();
      }
    } else {
      setShowNotifications(!showNotifications);
    }
  };

  const navigateTo = (path) => {
    // Since you're using React Router, you might want to use navigate instead
    window.location.href = path;
    setShowProfileMenu(false);
  };

  // Mock notifications (replace with real data)
  const notifications = [
    { id: 1, message: "New quiz available: JavaScript Fundamentals", time: "5 min ago", unread: true },
    { id: 2, message: "Course progress updated", time: "1 hour ago", unread: false },
    { id: 3, message: "Welcome to Preppo! Complete your profile", time: "2 hours ago", unread: true },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

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
        {/* Dark Mode Toggle */}
        <button
          className='flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full transition-all duration-200 hover:scale-105'
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {currentUser && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && currentUser && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-600">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 ${
                        notification.unread ? 'bg-gray-750' : ''
                      }`}
                    >
                      <p className={`text-sm ${notification.unread ? 'text-white font-medium' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full absolute right-4 top-4"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No notifications yet
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-600">
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

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
                <p className="font-medium text-white">{userData.name || 'User'}</p>
                <p className="text-xs text-gray-300 font-normal">{userData.email}</p>
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
                    <p className="text-sm font-medium text-white">{userData.name || 'User'}</p>
                    <p className="text-xs text-gray-300">{userData.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => navigateTo('/profile')}
                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-3" />
                  View Profile
                </button>
                
                <button
                  onClick={() => navigateTo('/settings')}
                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                
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