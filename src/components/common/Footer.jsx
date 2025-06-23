import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4" style={{ margin: 0, padding: '1rem 0' }}>
      <div className="container mx-auto text-center">
        <p className="text-sm" style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} Preppo. All rights reserved.<br></br> Contact Us{' - niranjanchaurasiya90@gmail.com '}
        </p>
      </div>
    </footer>
  )
}

export default Footer