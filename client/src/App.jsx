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
import AdminFmailyMembers from './components/admin/adminNav/AdminFmailyMembers';
import RejectedMember from './components/user/userNav/RejectedMember';
import EditFamilyMemeber from './components/user/userNav/EditFamilyMemeber';
import RejectedFamilyMember from './components/admin/adminNav/RejectedFamilyMembers';
import IdTable from './components/user/userNav/IdTable';
import IDRequest from './components/user/userNav/IdRequest';
import DetailMember from './components/admin/adminNav/DetailMember';
import IdRequestT from './components/admin/adminNav/IdRequestT';
import IdDetail from './components/admin/adminNav/IdDetail';
import VitalEvent from './components/user/userNav/VitalEvent';
import ParentCerteficate from './components/user/certefiacte/ParentCerteficate';
import VitalRequest from './components/admin/adminNav/VitalRequest';
import BirthDetail from './components/admin/adminNav/BirthDetail';
import Documents from './components/user/userNav/Documents';
import MarriageDetail from './components/admin/adminNav/MarriageDetail';
import DeathDetail from './components/admin/adminNav/DeathDetail';
import DivorceDetail from './components/admin/adminNav/DivorceDetail';
import NewMember from './components/admin/adminNav/NewMember';
import RemovedMember from './components/admin/adminNav/RemovedMember';
import RemovedFamilyMember from './components/user/userNav/RemovedFamilyMember';
import HeaderSetting from './components/user/userNav/HeaderSetting';
import AdminSetting from './components/admin/adminNav/AdminSetting';
import AdminDashbord from './components/admin/adminNav/AdminDashbord';
import FamilyHeaderDashboard from './components/user/userNav/FamilyHeaderDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/header-setting' element={<HeaderSetting />} />
        <Route path='/admin-profile' element={<AdminSetting />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminNav />}>
          <Route path='' element={<AdminDashbord />} />
          <Route path='family-headers' element={<FamilyHeaders />} />
          <Route path='add-family-header' element={<AddFamilyHeader />} />
          <Route path='family-members' element={<AdminFmailyMembers />} />
          <Route path='rejected-family-member' element={<RejectedFamilyMember />} />
          <Route path='get-detail-member/:id' element={<DetailMember />} />
          <Route path='id-request' element={<IdRequestT />} />
          <Route path='get-detail-id/:id' element={<IdDetail />} />
          <Route path='vital-event' element={<VitalRequest />} />
          {/* certificate detail info */}
          <Route path='birth-detail/:id' element={<BirthDetail />} />
          <Route path='marriage-detail/:id' element={<MarriageDetail />} />
          <Route path='death-detail/:id' element={<DeathDetail />} />
          <Route path='divorce-detail/:id' element={<DivorceDetail />} />
          <Route path='new-member' element={<NewMember />} />
          <Route path='remove-member' element={<RemovedMember />} />
        </Route>

        {/* family header Dashboard */}
        <Route path="/family-head-dashboard" element={<FamilyHeaderNav />}>
          <Route path='' element={<FamilyHeaderDashboard />} />
          <Route path='family-members' element={<FmailyMembers />} />
          <Route path='add-family-members' element={<AddFamilyMember />} />
          <Route path='rejected-memebrs' element={<RejectedMember />} />
          <Route path='edit-family-member/:id' element={<EditFamilyMemeber />} />
          <Route path='id' element={<IdTable />} />
          <Route path='id-request/:id' element={<IDRequest />} />
          <Route path='certificate/:id' element={<ParentCerteficate />} />
          <Route path='vital-event' element={<VitalEvent />} />
          <Route path='all-document' element={<Documents />} />
          <Route path='removed-family-member' element={<RemovedFamilyMember />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
