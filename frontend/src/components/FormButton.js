
import React from "react";
import { Button} from '@material-ui/core';

function FormButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      type={props.type}
      onClick={props.handleClick}
      disabled={props.disabled}
    >
      {props.text}
    </Button>
  )
}

FormButton.defaultProps = {
  disabled: false,
};

export default FormButton;