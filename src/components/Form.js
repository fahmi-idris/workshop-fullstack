import React, { useState } from "react";
import { TextField, Paper, Grid } from "@material-ui/core";

const Form = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleValueChange = e => {
    setValue(e.target.value);
  };

  const handleEnter = e => {
    if (e.keyCode === 13 && value !== "") {
      onSubmit(value);
      setValue('');
    }
  };

  return(
    <Paper style={{ margin: 16, padding: 16 }}>
    <Grid container>
      <Grid xs={12} md={12} item>
        <TextField
          placeholder="Add Todo here"
          value={value}
          onChange={handleValueChange}
          onKeyDown={handleEnter}
          fullWidth
        />
      </Grid>
    </Grid>
  </Paper>
  );
};

export default Form;
