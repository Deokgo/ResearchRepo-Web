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
            backgroundColor:
              clickedIndices.includes(index) // Check if the step is clicked
                ? step.activeColor // Set active color for clicked steps
                : hoveredIndex === index // Set hover color when hovered
                ? step.hoverColor
                : step.color, // Default color
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleStepClick(step, index)}
        >
          <div className="icon-badge-container">
            <i className={`fas ${step.icon}`}></i>
            <span className="badge">
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
