import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Courses from './pages/Subjects';
import Quiz from './pages/Quiz';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Header from './components/common/Header';
import DynamicQuiz from './components/DynamicQuiz';
import AllQuizzes from './components/quiz/AllQuizzes';
import TopicList from './components/subjects/TopicList';
import AuthDialog from './components/AuthDialog';
import { AuthProvider } from './context/AuthContext';

// Remove showHeader prop and always render Header and Navbar outside of main content
const Layout = ({ children }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const openAuthDialog = () => setIsAuthDialogOpen(true);
  const closeAuthDialog = () => setIsAuthDialogOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar onOpenAuthDialog={openAuthDialog} />
      <div className="flex-1 flex flex-col">
        <Header onOpenAuthDialog={openAuthDialog} />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={closeAuthDialog} 
      />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>
  },
  {
    path: "/quiz",
    element: <Layout><Quiz /></Layout>
  },
  {
    path: "/courses", 
    element: <Layout><Courses /></Layout>
  },
  {
    path: "quiz/:subject",
    element: <Layout><AllQuizzes/></Layout>
  },
  {
    path: "quiz/:subject/:quizNumber",
    element: <Layout><DynamicQuiz/></Layout>  
  },
  {
    path: "/learn/:subject",
    element: <Layout><TopicList /></Layout>
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;