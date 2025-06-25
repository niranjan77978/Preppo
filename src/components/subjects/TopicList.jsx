import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Lightbulb, NotebookText, List, BookOpenCheck, AlertCircle } from "lucide-react";
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

const SUBJECT_TOPICS = {
  networks: [
    "OSI Model",
    "TCP/IP Model",
    "IP Addressing",
    "Subnetting",
    "Routing Protocols",
    "Switching",
    "Network Topologies",
    "LAN vs WAN",
    "Wireless Networking",
    "Network Security",
    "Firewalls",
    "VPN",
    "DNS",
    "DHCP",
    "HTTP/HTTPS",
  ],
  os: [
    "Process Management",
    "Threads & Concurrency",
    "CPU Scheduling",
    "Memory Management",
    "Virtual Memory",
    "File Systems",
    "I/O Systems",
    "Deadlocks",
    "Security & Protection",
    "Linux Basics",
    "System Calls",
    "Paging & Segmentation",
    "Disk Scheduling",
    "Distributed OS",
    "Real-Time OS",
  ],
  dbms: [
    "Database Models",
    "ER Model",
    "Relational Model",
    "SQL Basics",
    "Normalization",
    "Transactions",
    "Indexing",
    "Joins",
    "ACID Properties",
    "NoSQL",
    "Stored Procedures",
    "Views",
    "Triggers",
    "Concurrency Control",
    "Database Security",
  ],
  ds: [
    "Arrays",
    "Linked Lists",
    "Stacks",
    "Queues",
    "Trees",
    "Graphs",
    "Hashing",
    "Searching",
    "Sorting",
    "Heaps",
    "Recursion",
    "Dynamic Programming",
    "Greedy Algorithms",
    "Backtracking",
    "Complexity Analysis",
  ],
  oops: [
    "Classes & Objects",
    "Inheritance",
    "Polymorphism",
    "Encapsulation",
    "Abstraction",
    "Constructors & Destructors",
    "Interfaces",
    "Abstract Classes",
    "Method Overloading",
    "Method Overriding",
    "Access Modifiers",
    "Static Members",
    "Exception Handling",
    "Design Patterns",
    "SOLID Principles",
  ],
  "web-dev": [
    "HTML Basics",
    "CSS Fundamentals",
    "JavaScript Essentials",
    "DOM Manipulation",
    "Responsive Design",
    "APIs & AJAX",
    "React Basics",
    "Routing",
    "State Management",
    "Node.js",
    "Express.js",
    "Databases in Web",
    "Authentication",
    "RESTful APIs",
    "Deployment",
  ],
};

const SUBJECT_NAMES = {
  networks: "Computer Networks",
  os: "Operating System",
  dbms: "DBMS",
  ds: "Data Structures",
  oops: "OOPS",
  "web-dev": "Web Development",
};

// Route mapping to match your Subjects component paths
const ROUTE_TO_SUBJECT = {
  '/learn/networks': 'networks',
  '/learn/os': 'os',
  '/learn/ds': 'ds',
  '/learn/dbms': 'dbms',
  '/learn/oops': 'oops',
  '/learn/web-dev': 'web-dev',
};

const SUBJECT_TO_ROUTE = {
  networks: '/learn/networks',
  os: '/learn/os',
  ds: '/learn/ds',
  dbms: '/learn/dbms',
  oops: '/learn/oops',
  'web-dev': '/learn/web-dev',
};

const ICON_COLORS = [
  "text-red-400",
  "text-blue-400",
  "text-pink-400",
  "text-yellow-300",
  "text-cyan-300",
  "text-indigo-400",
  "text-purple-400",
];

const getIconColor = (idx) => ICON_COLORS[idx % ICON_COLORS.length];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Utility to clean Gemini response: remove # and **
function cleanGeminiResponse(text) {
  return text
    .replace(/^#+\s*/gm, '') // Remove Markdown headings (#, ##, etc.)
    .replace(/\*\*/g, '')    // Remove all bold markers **
    .replace(/\*/g, '');     // Remove all asterisk markers *
}

// Helper function to get current subject from URL
const getCurrentSubjectFromURL = () => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    return ROUTE_TO_SUBJECT[currentPath] || 'networks';
  }
  return 'networks';
};

const TopicList = ({ subject }) => {
  // Get auth context for user progress
  const { currentUser, isTopicCompleted, updateTopicProgress } = useAuth();
  
  // Determine the current subject
  const currentSubject = subject || getCurrentSubjectFromURL();
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState('');

  // Use the determined subject
  const topics = SUBJECT_TOPICS[currentSubject] || [];

  // Debug logging to help identify the issue
  useEffect(() => {
    console.log('Current subject:', currentSubject);
    console.log('Available topics:', topics.length);
    console.log('Current URL:', typeof window !== 'undefined' ? window.location.pathname : 'N/A');
    console.log('Current user:', currentUser?.uid || 'Not logged in');
  }, [currentSubject, topics, currentUser]);

  const filteredTopics = search
    ? topics.filter((topic) =>
        topic.toLowerCase().includes(search.toLowerCase())
      )
    : topics;

  const fetchDetail = async (topic) => {
    setLoading(true);
    setDetail('');
    setSearchError('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Explain the following topic in detailed notes format for interview preparation and quick revision in ${SUBJECT_NAMES[currentSubject] || currentSubject}: ${topic}. 
Please provide:
1. Clear definition and overview
2. Key concepts and components
3. Important points to remember
4. Practical examples where applicable
5. Common interview questions related to this topic
Format the response with proper headings, bullet points, and structured content for easy reading and revision.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      let explanation = "";
      
      if (data?.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        if (candidate?.content?.parts && candidate.content.parts.length > 0) {
          explanation = candidate.content.parts[0].text;
        } else if (candidate?.finishReason === "SAFETY") {
          explanation = "Content was blocked due to safety filters. Please try rephrasing your query.";
        }
      }
      
      if (!explanation || explanation.trim() === '') {
        explanation = "Unable to generate explanation. Please check your API key and try again.";
      }
      
      setDetail(cleanGeminiResponse(explanation));
      
    } catch (err) {
      console.error('Fetch error:', err);
      let errorMessage = `Failed to fetch explanation: ${err.message}`;
      
      if (err.message.includes('400')) {
        errorMessage += '\n\nPossible issues:\n• Invalid API key\n• API key quota exceeded\n• Request format error';
      } else if (err.message.includes('403')) {
        errorMessage += '\n\nAPI key may be invalid or access denied.';
      }
      
      setDetail(errorMessage);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (selectedTopic) {
      fetchDetail(selectedTopic);
    }
  }, [selectedTopic, currentSubject]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setSearchError('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() === '') {
      setSearchError('Please enter a topic to search.');
      return;
    }
    setSelectedTopic(search.trim());
  };

  // Updated toggle function with optimistic updates for instant UI response
  const toggleCompleted = async (topic) => {
    if (!currentUser) {
      alert('Please log in to track your progress.');
      return;
    }

    const isCurrentlyCompleted = isTopicCompleted(currentSubject, topic);
    const newCompletionState = !isCurrentlyCompleted;
    
    try {
      // This will update the UI immediately thanks to optimistic updates in AuthContext
      await updateTopicProgress(currentSubject, topic, newCompletionState);
    } catch (error) {
      console.error('Error updating topic progress:', error);
      alert('Failed to update topic progress. Please try again.');
    }
  };

  // Show error message if no topics found for the subject
  if (!topics.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-10 px-2 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-cyan-900/40 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertCircle className="text-red-400 w-8 h-8 drop-shadow" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-red-400 text-center tracking-tight drop-shadow">
              Subject Not Found
            </h2>
          </div>
          <p className="text-center text-gray-300 mb-6">
            The subject "{currentSubject}" was not found. Please check the URL or go back to subjects.
          </p>
          <div className="text-center">
            <button 
              onClick={() => window.history.back()} 
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-cyan-900/40 relative">
        {/* Subject Title */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <List className="text-cyan-400 w-8 h-8 drop-shadow" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-400 text-center tracking-tight drop-shadow">
            {SUBJECT_NAMES[currentSubject] || currentSubject}
          </h2>
        </div>
        <p className="text-center text-cyan-200 mb-6 flex items-center justify-center gap-2 text-sm md:text-base">
          <Lightbulb className="inline w-5 h-5 text-yellow-300" />
          Click a topic or search your own for instant revision notes.
          {!currentUser && (
            <span className="text-yellow-300 ml-2">(Login to track progress)</span>
          )}
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative w-full sm:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-cyan-400 bg-gray-800 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Search or enter your own topic..."
              value={search}
              onChange={handleSearch}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="button"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow"
            onClick={handleSearchSubmit}
          >
            Search
          </button>
        </div>
        
        {searchError && (
          <div className="text-red-400 mb-4 text-center">{searchError}</div>
        )}
        
        <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTopics.map((topic, idx) => {
            const isCompleted = currentUser ? isTopicCompleted(currentSubject, topic) : false;
            
            return (
              <li key={topic}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl hover:cursor-pointer  border-2 font-semibold transition-all duration-200 shadow-sm flex items-center gap-2 text-sm
                    ${selectedTopic === topic
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white scale-105 shadow-lg"
                      : "bg-gray-800 border-gray-700 text-cyan-100 hover:bg-cyan-900 hover:border-cyan-400 hover:text-cyan-300"
                    }
                  `}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <BookOpen className={`w-4 h-4 ${getIconColor(idx)} flex-shrink-0`} />
                  <span className="flex-1 min-w-0">{topic}</span>
                  <div
                    className={`w-6 h-6 flex items-center justify-center border-2 rounded-md transition-colors duration-200 flex-shrink-0 cursor-pointer
                      ${isCompleted
                        ? "border-green-400 bg-green-100/10"
                        : "border-gray-500 bg-gray-800 hover:border-green-400"
                      }
                    `}
                    title={
                      !currentUser 
                        ? "Login to track progress"
                        : isCompleted 
                          ? "Mark as incomplete" 
                          : "Mark as completed"
                    }
                    onClick={e => {
                      e.stopPropagation();
                      if (currentUser) {
                        toggleCompleted(topic);
                      } else {
                        alert('Please log in to track your progress.');
                      }
                    }}
                  >
                    {isCompleted ? (
                      <BookOpenCheck className="w-4 h-4 text-green-400" />
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        
        {selectedTopic && (
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-2xl shadow-2xl p-6 md:p-8 mt-8 border border-cyan-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <NotebookText className="w-6 h-6 text-yellow-300" />
              <h3 className="text-xl font-bold text-cyan-300">{selectedTopic}</h3>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-cyan-200">
                <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Loading explanation...
              </div>
            ) : (
              <div className="text-cyan-100 whitespace-pre-line leading-relaxed prose prose-invert max-w-none">
                {detail}
              </div>
            )}
          </div>
        )}
        
        {!filteredTopics.length && (
          <div className="text-center text-cyan-200 mt-8">
            No topics found for "{search}".
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicList;