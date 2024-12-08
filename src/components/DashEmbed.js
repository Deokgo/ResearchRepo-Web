import React, { useState, useEffect } from "react";
import axios from "axios";

const DashEmbed = () => {
  const [dashUrl, setDashUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the Dash app URL
    const fetchDashUrl = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT from local storage
        if (!token) {
          setError("No access token found.");
          return;
        }
        const response = await axios.get("/dash/sampledash", {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT to the request headers
          },
        });

        // Check if response contains URL
        if (response.data?.url) {
          setDashUrl(response.data.url); // Set the Dash app URL
        } else {
          setError("Failed to retrieve Dash app URL.");
        }
      } catch (err) {
        // Improved error handling
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to load Dash app."
        );
      }
    };

    fetchDashUrl();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashUrl) {
    return <div>Loading Dash app...</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={dashUrl}
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        title="Dash App"
      />
    </div>
  );
};

export default DashEmbed;
