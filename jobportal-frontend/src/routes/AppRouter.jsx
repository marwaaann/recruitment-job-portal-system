import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import Jobs from "../pages/Jobs/Jobs";
import CreateJob from "../pages/Jobs/CreateJob";
import JobDetails from "../pages/Jobs/JobDetails";
import EditJob from "../pages/Jobs/EditJob";

import Clients from "../pages/Clients/Clients";
import CreateClient from "../pages/Clients/CreateClient";
import EditClient from "../pages/Clients/EditClient";
import ClientDetails from "../pages/Clients/ClientDetails";

import Candidates from "../pages/Candidate/Candidates";
import CandidateDetails from "../pages/Candidate/CandidateDetails";
import CreateCandidate from "../pages/Candidate/CreateCandidate";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import EditCandidate from "../pages/Candidate/EditCandidate";

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
import Pipeline from "../pages/Pipeline/Pipeline";
import Messages from "../pages/Messages/Messages";

import ChatPanel from "../components/chat/ChatPanel";

export default function AppRouter() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

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

        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/applications" element={<Pipeline />} />
        <Route path="/interviews" element={<Pipeline />} />
        <Route path="/offers" element={<Pipeline />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat" element={<Messages />} />







        
      </Route>
    </Routes>
  );
}