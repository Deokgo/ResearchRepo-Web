import React, { useState, useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Box } from "@mui/material";

export default function DynamicTimeline({ researchId, refresh }) {
  const [events, setEvents] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API whenever researchId or refresh changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/track/research_status/${researchId}`);
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setEvents(data);  // Set the data to state
        } else {
          setError("Received data is not an array");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchData whenever the `refresh` or `researchId` changes
    fetchData();
  }, [researchId, refresh]); // Re-run when researchId or refresh changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render the Timeline component when data is available
  return (
    <Box sx={{ width: "100%", margin: "" }}>
      <Timeline sx={{ paddingLeft: "15%", "& .MuiTimelineItem-root:before": { display: "none" } }}>
        {events.length === 0 ? (
          <TimelineItem>
            <TimelineContent>No events found</TimelineContent>
          </TimelineItem>
        ) : (
          events.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  style={{
                    backgroundColor: index === events.length - 1 ? "red" : "#888",
                  }}
                />
                {index < events.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div>{event.status}</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  {event.time}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))
        )}
      </Timeline>
    </Box>
  );
}
