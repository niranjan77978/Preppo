import { Book, LucideZap, Target } from 'lucide-react'
import React from 'react'

// Global color tracker to ensure unique colors across cards
let usedColors = [];
let colorIndex = 0;

const SubjectCard = ({ 
  subjectName = "Computer Networks", 
  description = "Comprehensive networking fundamentals with hands-on practice and real-world scenarios.", 
  learningPath = "/learn",
  quizPath = "/quiz"
}) => {
  const getUniqueButtonColor = () => {
    const colors = [
      'bg-blue-600 hover:bg-blue-700',
      'bg-red-600 hover:bg-red-700',
      'bg-purple-600 hover:bg-purple-700',
      'bg-orange-600 hover:bg-orange-700',
      'bg-indigo-600 hover:bg-indigo-700',
      'bg-pink-600 hover:bg-pink-700',
    ];
    
    // Reset if we've used all colors
    if (colorIndex >= colors.length) {
      colorIndex = 0;
      usedColors = [];
    }
    
    // Shuffle colors array to make order random
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    
    const selectedColor = shuffledColors[colorIndex];
    colorIndex++;
    
    return selectedColor;
  };
  
  const uniqueButtonColor = getUniqueButtonColor();

  return (
    <div>
      <div className='flex flex-col m-4 p-3 justify-center bg-gray-900 text-white max-w-xs text-center rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out'>
        <div className=' text-2xl font-bold'>
            {subjectName}
        </div>
        <div className='flex flex-col justify-center items-center text-sm m-2  pt-3 text-gray-300 rounded-xl p-2 mt-2  min-h-50 bg-gray-700'>
            <p className=''>{description}</p>
            <button 
              className={`mt-4 items-center justify-center flex w-40 text-white px-4 py-2 rounded-xl transition-colors duration-200 ease-in-out ${uniqueButtonColor}`}
              onClick={() => window.location.href = learningPath}
            >
              <Book size={18}/>
                <span className='ml-2'>Start Learning</span>
            </button>
            <button className='mt-2 w-40 flex justify-center bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200 ease-in-out' 
                onClick={() => window.location.href = quizPath}>
                  <Target size={18}/>
                <span className='ml-2'>Take a Quiz</span>
            </button>
        </div>
        
    </div>
    </div>
  )
}

export default SubjectCard