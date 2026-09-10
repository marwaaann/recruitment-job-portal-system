import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Jobs from "../pages/Jobs/Jobs";
import CreateJob from "../pages/Jobs/CreateJob";
import JobDetails from "../pages/Jobs/JobDetails";
import EditJob from "../pages/Jobs/EditJob";

import Clients from "../pages/Clients/Clients";
import CreateClient from "../pages/Clients/CreateClient";
import EditClient from "../pages/Clients/EditClient";
import ClientDetails from "../pages/Clients/ClientDetails";

import Candidates from "../pages/candidate/Candidates";
import CandidateDetails from "../pages/candidate/CandidateDetails";
import CreateCandidate from "../pages/candidate/CreateCandidate";
import EditCandidate from "../pages/candidate/EditCandidate";
import Pipeline from "../pages/Pipeline/Pipeline";
import Partners from "../pages/Partners/Partners";
import CreatePartner from "../pages/Partners/CreatePartner";
import EditPartner from "../pages/Partners/EditPartner";
import PartnerDetails from "../pages/Partners/PartnerDetails";

import Admins from "../pages/Admins/Admins";
import CreateAdmin from "../pages/Admins/CreateAdmin";
import EditAdmin from "../pages/Admins/EditAdmin";
import AdminDetails from "../pages/Admins/AdminDetails";

import Users from '../pages/Users/Users';
import CreateUser from '../pages/Users/CreateUser';
import UserDetails from '../pages/Users/UserDetails';
import EditUser from '../pages/Users/EditUser';

import Settings from '../pages/Settings/Settings';

import ChatPanel from "../components/chat/ChatPanel";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/create" element={<CreateJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/edit/:id" element={<EditJob />} />



       <Route path="/clients" element={<Clients />} />
<Route path="/clients/create" element={<CreateClient />} />
<Route path="/clients/:id" element={<ClientDetails />} />
<Route path="/clients/edit/:id" element={<EditClient />} />




        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/create" element={<CreateCandidate />} />
        <Route path="/candidates/:id" element={<CandidateDetails />} />
        <Route path="/candidates/edit/:id" element={<EditCandidate />} />

        <Route path="/pipeline" element={<Pipeline />} />



        <Route path="/partners" element={<Partners />} />

<Route path="/partners/create" element={<CreatePartner />} />

<Route path="/partners/:id" element={<PartnerDetails />} />

<Route path="/partners/edit/:id" element={<EditPartner />} />




         <Route path="/admins" element={<Admins />} />
        <Route path="/admins/create" element={<CreateAdmin />} />
        <Route path="/admins/:id" element={<AdminDetails />} />
        <Route path="/admins/edit/:id" element={<EditAdmin />} />

        <Route path='/users' element={<Users />} />
        <Route path='/users/create' element={<CreateUser />} />
        <Route path='/users/:id' element={<UserDetails />} />
        <Route path='/users/edit/:id' element={<EditUser />} />


        <Route path="/settings" element={<Settings />} />

        <Route path="/chat" element={<ChatPanel embedded onClose={() => window.history.back()} />} />
        <Route path="/messages" element={<ChatPanel embedded onClose={() => window.history.back()} />} />







        
      </Route>
    </Routes>
  );
}