import React, { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import Profile from "./components/profile";
import PrivateRoute from "./components/privateroute";
import ManageUsers from "./components/manageusers";
import PasswordReset from "./components/passwordreset";
import { CssBaseline } from "@mui/material"; // To remove default margin
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KnowledgeGraph from "./components/knowledgegraph";
import { ModalProvider } from "./components/modalcontext";

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

          <Route path='/resetpassword' element={<PasswordReset />} />
          <Route path='/knowledgegraph' element={<KnowledgeGraph />} />
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
