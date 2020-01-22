
import React from "react";

import {TextField} from "@material-ui/core";


export default function DescriptionField ({value, touched, error, handleChange}) {
  return (
      <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        name="description"
        value={value}
        onChange={handleChange}
        variant={"outlined"}
        label="Description"
        required
        multiline
        rowsMax="2"
        inputProps={{ maxLength: 128 }}
    />
  )
}



