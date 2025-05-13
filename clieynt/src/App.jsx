import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './components/login/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
