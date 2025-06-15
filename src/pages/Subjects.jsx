import React from 'react'
import SubjectCard from '../components/subjects/SubjectCard'

const Subjects = () => {
  return (
    <>
      <div className='flex flex-col items-center  justify-start min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden p-4'>
        <div className='flex flex-wrap items-center  w-[80%]  gap-8   '>
          <SubjectCard
            subjectName="Computer Networks"
            description="Comprehensive networking fundamentals with hands-on practice and real-world scenarios."
            learningPath="/learn/networks"
            quizPath="/quiz/cnquiz"
          />
          <SubjectCard
            subjectName="Operating System"
            description="Master OS concepts including processes, memory management, and system calls."
            learningPath="/learn/os"
            quizPath="/quiz/osquiz"
          />
          <SubjectCard
            subjectName="Data Structures"
            description="Learn essential data structures and algorithms for efficient programming."
            learningPath="/learn/ds"
            quizPath="/quiz/dsquiz"
          />
          <SubjectCard
            subjectName="DBMS"
            description="Database management systems with SQL, normalization, and transaction concepts."
            learningPath="/learn/dbms"
            quizPath="/quiz/dbmsquiz"
          />
          <SubjectCard
            subjectName="OOPS"
            description="Object-oriented programming concepts including classes, inheritance, and polymorphism."
            learningPath="/learn/oops"
            quizPath="/quiz/oopsquiz"
          />
          <SubjectCard
            subjectName="Web Development"
            description="Full-stack web development with HTML, CSS, JavaScript, and modern frameworks."
            learningPath="/learn/web-dev"
            quizPath="/quiz/webdevquiz"
          />
        </div>
      </div>
    </>
  )
}

export default Subjects