import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

const AutoCompleteTextBox = ({
  data,
  placeholder,
  onItemSelected,
  label,
  id,
  sx,
  inputlabel,
  value, // New prop for controlled input
}) => {
  const [inputValue, setInputValue] = useState(value || ""); // Initialize with value prop
  const [suggestions, setSuggestions] = useState([]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Optional: Notify parent component while typing
    if (onItemSelected) onItemSelected(newValue);

    // Filter suggestions based on user input
    const filteredSuggestions = data.filter((item) =>
      item.toLowerCase().includes(newValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion); // Update internal state
    setSuggestions([]); // Clear suggestions
    if (onItemSelected) onItemSelected(suggestion); // Notify parent component
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <TextField
        id={id}
        label={label}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Type to search..."}
        fullWidth
        variant="outlined"
        margin="dense"
        sx={sx}
        InputLabelProps={inputlabel}
      />
      {suggestions.length > 0 && (
        <Paper
          elevation={3}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

AutoCompleteTextBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  onItemSelected: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  sx: PropTypes.object,
  inputlabel: PropTypes.object,
  value: PropTypes.string, // New prop for controlled input
};

export default AutoCompleteTextBox;
