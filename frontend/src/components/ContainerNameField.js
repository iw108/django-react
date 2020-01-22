import React from "react";

import {TextField} from "@material-ui/core";


export default function ContainerNameField ({value, touched, error, handleChange, encrypted, required}) {

  const getContainerNameHelpText = () => {
    const filler = (encrypted) ? "encrypted": "";
    return (touched && error) || `* Name of the ${filler} container`
  };

  return (
    <React.Fragment>
      <div>
        <TextField
          error={!!(touched && error)}
          helperText={getContainerNameHelpText()}
          name="containerName"
          value={value}
          onChange={handleChange}
          variant={"outlined"}
          label={"Container name"}
          disabled={!(required)}
          required={required}
        />
      </div>
    </React.Fragment>
  )
}