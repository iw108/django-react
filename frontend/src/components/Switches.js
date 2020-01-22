import React from "react";
import {FormControl, FormControlLabel, Switch} from "@material-ui/core";

export default function Switches({encrypt, container, handleSwitch}) {
  return (
    <React.Fragment>
      <FormControl component={"fieldset"} label={'asdasdasdasd'}>
        <FormControlLabel
          label="Encrypt"
          control={
            <Switch
              color="primary"
              value="encrypt"
              checked={encrypt}
              onChange={handleSwitch}
            />
          }
        />
        <FormControlLabel
          label="Container"
          control={
            <Switch
              color="primary"
              value="container"
              checked={encrypt || container}
              onChange={handleSwitch}
              disabled={encrypt}
            />
          }
        />
      </FormControl>
    </React.Fragment>
  )
}