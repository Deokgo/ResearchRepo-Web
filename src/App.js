import React, { useState, useEffect } from "react";
import Home from "./pages/home";
import ReadMore from "./pages/readmore";
import AboutUs from "./pages/aboutus";
import Help from "./pages/help";
import Profile from "./pages/profile";
import PrivateRoute from "./components/privateroute";
import ManageUsers from "./pages/manageusers";
import ResearchThrust from "./pages/researchthrust";
import ResearchTracking from "./pages/researchtracking";
import UpdateTrackingInfo from "./pages/updatetrackinginfo";
import Collection from "./pages/collection";
import ManagePapers from "./pages/managepapers";
import ManageCollege from "./pages/managecollege";
import ManageProgram from "./pages/manageprogram";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KnowledgeGraph from "./pages/knowledgegraph";
import { ModalProvider } from "./context/modalcontext";
import { AuthProvider } from "./context/AuthContext";
import MainDash from "./pages/maindash";
import PubDash from "./pages/pubdash";
import DisplayResearchInfo from "./pages/displayresearchinfo";
import DisplayAuditLog from "./pages/auditlog";
import RoleBasedRoute from "./components/rolebasedroute";
import DashEmbed from "./pages/DashEmbed";
import ProgDash from "./pages/ProgDash";
import SDGdashEmbed from "./pages/SDGdashEmbed";
import EngageDash from "./pages/EngageDash";
import Backup from "./pages/backup";
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

            {/* Common routes (available to all authenticated users) */}
            <Route
              path='/collection'
              element={
                <PrivateRoute>
                  <Collection />
                </PrivateRoute>
              }
            />

            {/* Knowledge Graph route - accessible to all */}
            <Route
              path='/knowledgegraph'
              element={
                <PrivateRoute>
                  <KnowledgeGraph />
                </PrivateRoute>
              }
            />

            <Route
              path='/displayresearchinfo/:id'
              element={
                <PrivateRoute>
                  <DisplayResearchInfo />
                </PrivateRoute>
              }
            />

            <Route
              path='/updatetrackinginfo'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["05"]}>
                    <UpdateTrackingInfo />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* System Administrator only routes */}
            <Route
              path='/manage-users'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["01"]}>
                    <ManageUsers />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path='/managecollege'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["01"]}>
                    <ManageCollege />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path='/manageprogram'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["01"]}>
                    <ManageProgram />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path='/auditlog'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["01"]}>
                    <DisplayAuditLog />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path='/backup'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["01"]}>
                    <Backup />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Research Tracking (Head Executive, Director, Program Admin) */}
            <Route
              path='/researchtracking'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["02", "03", "05"]}>
                    <ResearchTracking />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* College, Head and RPCO Administrator only routes */}
            <Route
              path='/dash'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["04", "02", "03"]}>
                    <DashEmbed />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path='/progdash'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["05"]}>
                    <DashEmbed />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path='/publication'
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["04"]}>
                    <PubDash />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Other protected routes */}
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path='/aboutus'
              element={
                <PrivateRoute>
                  <AboutUs />
                </PrivateRoute>
              }
            />

            <Route
              path='/help'
              element={
                <PrivateRoute>
                  <Help />
                </PrivateRoute>
              }
            />

            {/* ... other routes ... */}
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
