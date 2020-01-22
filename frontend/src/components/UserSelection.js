
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {FormControlLabel, FormGroup, Switch} from "@material-ui/core";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
export const users = [
  { value: '0', label: 'hello@gmail.com' },
  { value: '1', label: 'goodbye@gmail.com'},
];

export default function TransferList() {

  const props = {
    inputOptions: users,
  };

  return (
    <Autocomplete
      multiple
      options={props.inputOptions}
      disableCloseOnSelect
      getOptionLabel={option => option.label}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.label}
        </React.Fragment>
      )}
      style={{ width: 400 }}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Recipients"
          placeholder=""
          required
          fullWidth
        />
      )}
    />
  );
}


