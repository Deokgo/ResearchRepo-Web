import React, { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import Main from "./components/main"
import Profile from "./components/profile";
import PrivateRoute from "./components/privateroute";
import ManageUsers from "./components/manageusers";
import PasswordReset from "./components/passwordreset";
import ResearchThrust from "./components/researchthrust"
import ResearchTracking from "./components/researchtracking"
import ManagePapers from "./components/managepapers"
import { CssBaseline } from "@mui/material"; // To remove default margin
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KnowledgeGraph from "./components/knowledgegraph";
import { ModalProvider } from "./components/modalcontext";
import MainDash from "./components/maindash";
import PubDash from "./components/pubdash";

function App() {
  const [data, setData] = useState([{}]);

  return (
    <ModalProvider>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route path='/home' element={<Home />} />
          <Route path='/main' element={<Main />} />

          <Route path='/resetpassword' element={<PasswordReset />} />
          <Route path='/knowledgegraph' element={<KnowledgeGraph />} />
          <Route path='/maindash' element={<MainDash />} />
          <Route path='/publication' element={<PubDash />} />
          <Route path='/researchthrust' element={<ResearchThrust />} />
          <Route path='/researchtracking' element={<ResearchTracking />} />
          <Route path='/managepapers' element={<ManagePapers />} />

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
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
