import React, { useState } from "react";
import "../styles/arrowsteps.css"; // Ensure the CSS file is imported

const ArrowSteps = ({ steps, onStepClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track the hovered step
  const [clickedIndices, setClickedIndices] = useState([]); // Track clicked steps

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const handleStepClick = (step, index) => {
    setClickedIndices((prevClicked) => {
      if (prevClicked.includes(index)) {
        return prevClicked.filter((clickedIndex) => clickedIndex !== index);
      } else {
        return [...prevClicked, index];
      }
    });

    onStepClick(step); 
  };

  return (
    <div className="arrow-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className="arrow"
          style={{
            width: "100%",  // Adjust arrow width
            height: "80px", // Adjust arrow height
            backgroundColor:
              clickedIndices.includes(index)
                ? step.activeColor
                : hoveredIndex === index
                ? step.hoverColor
                : step.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px", // Optional: round corners
            transition: "background-color 0.3s",
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleStepClick(step, index)}
        >
          <div className="icon-badge-container" style={{ display: "flex", alignItems: "center" }}>
            <i className={`fas ${step.icon}`} style={{ fontSize: "30px", marginRight: "6px" }}></i>
            <span className="badge" style={{ fontSize: "14px", width: "27px", height: "24px", lineHeight: "15px" }}>
              {step.badge >= 100 ? "99+" : step.badge}
            </span>
          </div>
          <div className="label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ArrowSteps;
