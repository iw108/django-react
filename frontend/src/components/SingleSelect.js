
/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default function SingleSelect({inputOptions, label}) {

  return (
    <Autocomplete
      onInputChange={(event, value, reason) => {
        switch (reason) {
          case 'reset':
            if (event.target.tagName === "LI") {
              const optionIndex = event.target.getAttribute('data-option-index');
              console.log(inputOptions[optionIndex].value);
            }
            break;
          default:
            console.log(reason);
        }
      }}
      getOptionSelected= {(option, value) => {
        return option.value === value.value;
      }}
      options={inputOptions}
      getOptionLabel={option => option.label}
      style={{ width: 400 }}
      renderInput={params => (
        <TextField {...params} label={label} variant="outlined" required/>
      )}
    />
  );
}


