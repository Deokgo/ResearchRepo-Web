import React, { useState } from "react";
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
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Optional: Notify parent component while typing
    if (onItemSelected) onItemSelected(value);

    // Filter suggestions based on user input
    const filteredSuggestions = data.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
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
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <List >
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion} primaryTypographyProps={{ fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          } }}/>
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
};

export default AutoCompleteTextBox;
