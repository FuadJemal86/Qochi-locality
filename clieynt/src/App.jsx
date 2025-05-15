import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './components/login/Login';
import AdminNav from './components/admin/adminNav/AdminNav';
import FamilyHeaders from './components/admin/adminNav/FamilyHeaders';
import AddFamilyHeader from './components/admin/adminNav/AddFamilyHeader';
import FamilyHeaderNav from './components/user/userNav/FamilyHeaderNav';
import FmailyMembers from './components/user/userNav/FamilyMembers';
import AddFamilyMember from './components/user/userNav/AddFamilyMember';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminNav />}>
          <Route path='family-headers' element={<FamilyHeaders />} />
          <Route path='add-family-header' element={<AddFamilyHeader />} />



        </Route>

        {/* family header Dashboard */}
        <Route path="/family-head-dashboard" element={<FamilyHeaderNav />}>
          <Route path='family-members' element={<FmailyMembers />} />
          <Route path='add-family-members' element={<AddFamilyMember />} />




        </Route>
      </Routes>
    </Router>
  )
}

export default App
