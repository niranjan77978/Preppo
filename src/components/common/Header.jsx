import React, { useState } from 'react'
import { Sun, Moon, UserCircle } from 'lucide-react';

const Header = () => {

    const [darkMode, setDarkMode] = useState(true);
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
  return (  
    <div className='flex bg-gray-900 h-20 text-white p-4 w-full text-2xl font-bold'>
       <a href="/" className='hover:text-gray-200 ml-11' style ={{fontFamily:"Sansita Swashed"}}>Preppo</a>
       <div className="flex items-center ml-auto gap-6">
        <button
            className='flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 rounded-full'
            onClick={toggleDarkMode}
        >
            {darkMode ? <Sun /> : <Moon />}
        </button>
        <button>
            <UserCircle className='w-9 h-9 text-gray-400 hover:text-gray-200 rounded-full' />
        </button>
    </div>
    </div>
  )
}

export default Header