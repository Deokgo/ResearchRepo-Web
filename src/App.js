import React, { useState, useEffect } from "react";
import Home from "./components/home";
import ReadMore from "./components/readmore";
import Profile from "./components/profile";
import PrivateRoute from "./components/privateroute";
import ManageUsers from "./components/manageusers";
import ResearchThrust from "./components/researchthrust";
import ResearchTracking from "./components/researchtracking";
import UpdateResearchInfo from "./components/updateresearchinfo";
import Collection from "./components/collection";
import ManagePapers from "./components/managepapers";
import { CssBaseline } from "@mui/material"; // To remove default margin
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KnowledgeGraph from "./components/knowledgegraph";
import { ModalProvider } from "./components/modalcontext";
import MainDash from "./components/maindash";
import PubDash from "./components/pubdash";

function App() {
  const [data, setData] = useState([{}]);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <ModalProvider>
      <Router>
        <CssBaseline />
        <Routes>
          {/**Add more condition here which depends on the user role (e.g. if sysadmin the view is manage papers)*/}
          {!isLoggedIn ? (
            <Route path='/' element={<Home />} />
          ) : (
            <Route path='/' element={<ManagePapers />} />
          )}
          <Route path='/collection' element={<Collection />} />
          <Route path='/home' element={<Home />} />
          <Route path='/readmore' element={<ReadMore />} />

          <Route path='/knowledgegraph' element={<KnowledgeGraph />} />
          <Route path='/maindash' element={<MainDash />} />
          <Route path='/publication' element={<PubDash />} />
          <Route path='/researchthrust' element={<ResearchThrust />} />
          <Route path='/researchtracking' element={<ResearchTracking />} />
          <Route path='/updateresearchinfo' element={<UpdateResearchInfo />} />
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
