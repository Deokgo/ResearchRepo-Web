import React, { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import { CssBaseline } from "@mui/material"; // To remove default margin
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [data, setData] = useState([{}]);

  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
