import React, { useState, useEffect } from "react";
import Signup from "./components/signup";
import { CssBaseline } from "@mui/material"; // To remove default margin

function App() {
  const [data, setData] = useState([{}]);

  return (
    <div class='App'>
      <CssBaseline />
      <Signup />
    </div>
  );
}

export default App;
