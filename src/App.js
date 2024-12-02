import React, { useState, useEffect } from "react";
import Home from "./components/home";
import ReadMore from "./components/readmore";
import Profile from "./components/profile";
import PrivateRoute from "./components/privateroute";
import ManageUsers from "./components/manageusers";
import ResearchThrust from "./components/researchthrust";
import ResearchTracking from "./components/researchtracking";
import UpdateResearchInfo from "./components/updateresearchinfo";
import UpdateTrackingInfo from "./components/updatetrackinginfo";
import Collection from "./components/collection";
import ManagePapers from "./components/managepapers";
import ManageCollege from "./components/managecollege";
import ManageProgram from "./components/manageprogram";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KnowledgeGraph from "./components/knowledgegraph";
import { ModalProvider } from "./components/modalcontext";
import { AuthProvider } from "./context/AuthContext";
import MainDash from "./components/maindash";
import PubDash from "./components/pubdash";
import DisplayResearchInfo from "./components/displayresearchinfo";
import DisplayAuditLog from "./components/auditlog";

function App() {
  const [data, setData] = useState([{}]);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
          <CssBaseline />
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/readmore' element={<ReadMore />} />
            <Route path='/researchthrust' element={<ResearchThrust />} />

            {/* Protected routes */}
            <Route
              path='/knowledgegraph'
              element={
                <PrivateRoute>
                  <KnowledgeGraph />
                </PrivateRoute>
              }
            />
            <Route
              path='/collection'
              element={
                <PrivateRoute>
                  <Collection />
                </PrivateRoute>
              }
            />
            <Route
              path='/maindash'
              element={
                <PrivateRoute>
                  <MainDash />
                </PrivateRoute>
              }
            />
            <Route
              path='/publication'
              element={
                <PrivateRoute>
                  <PubDash />
                </PrivateRoute>
              }
            />

            <Route
              path='/researchtracking'
              element={
                <PrivateRoute>
                  <ResearchTracking />
                </PrivateRoute>
              }
            />
            <Route
              path='/updateresearchinfo'
              element={
                <PrivateRoute>
                  <UpdateResearchInfo />
                </PrivateRoute>
              }
            />
            <Route
              path='/updatetrackinginfo'
              element={
                <PrivateRoute>
                  <UpdateTrackingInfo />
                </PrivateRoute>
              }
            />
            <Route
              path='/managepapers'
              element={
                <PrivateRoute>
                  <ManagePapers />
                </PrivateRoute>
              }
            />
            <Route
              path='/managecollege'
              element={
                <PrivateRoute>
                  <ManageCollege />
                </PrivateRoute>
              }
            />
            <Route
              path='/manageprogram'
              element={
                <PrivateRoute>
                  <ManageProgram />
                </PrivateRoute>
              }
            />
            <Route
              path='/displayresearchinfo/:research_id'
              element={
                <PrivateRoute>
                  <DisplayResearchInfo />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path='/manage-users'
              element={
                <PrivateRoute>
                  <ManageUsers />
                </PrivateRoute>
              }
            />
            <Route
              path='/auditlog'
              element={
                <PrivateRoute>
                  <DisplayAuditLog />
                </PrivateRoute>
              }
            />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
