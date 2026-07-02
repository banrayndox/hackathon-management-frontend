import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Landing from './layout/Landing.jsx';

// নতুন ইমপোর্ট
import Login from './pages/Login.jsx';
import Callback from './pages/Callback.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import TeamsList from './pages/TeamList.jsx';
import TeamListLanding from './layout/TeamListLanding.jsx';
import LeaderBoardLanding from './layout/LeaderBoardLanding.jsx';
import TeamProfileLanding from './layout/TeamProfileLanding.jsx';
import ProfileLanding from './layout/ProfileLanding.jsx';
import JudgesListLanding from './layout/JudgeListLanding.jsx';
import AdminDashboardLanding from './layout/AdminDashboardLanding.jsx';
import JudgeDashboardLanding from './layout/JudgeDashboardLanding.jsx';
import ParticipantsDashboardLanding from './layout/ParticipantsDashboardLanding.jsx';
import PaymentConfirmationLanding from './layout/PaymentConfirmationLanding.jsx';
import NotHumanLanding from './layout/NotHumanLanding.jsx';

const App = () => {
  return (
    <Routes>
    
      <Route path="/" element={<Landing />} />
      {/* <Route path="/not-human" element={<NotHumanLanding />} /> */}
      <Route path="/judgeslist" element={<ProtectedRoute allowedRoles={['admin', 'judge', 'participant']}><JudgesListLanding /></ProtectedRoute>} />
      {/* <Route path="/teamlist" element={<TeamListLanding />} /> */}
      <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['admin', 'judge', 'participant']}><LeaderBoardLanding /></ProtectedRoute>} />
      <Route 
          path="/team-profile/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'judge', 'participant']}>
              <TeamProfileLanding />
            </ProtectedRoute>
          } 
        />  
   
      <Route path="/auth/callback" element={<Callback />} />

      {/* <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <ProfileLanding />
          </ProtectedRoute>
        }
      /> */}


      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge/dashboard"
        element={
          <ProtectedRoute allowedRoles={['judge']}>
            <JudgeDashboardLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/participants/dashboard"
        element={
          <ProtectedRoute allowedRoles={['participant']}>
            <ParticipantsDashboardLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/participants/payment"
        element={
          <ProtectedRoute allowedRoles={['participant']}>
            <PaymentConfirmationLanding />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

export default App;


