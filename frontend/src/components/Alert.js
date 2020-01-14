
import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';


function AlertDismissible(props) {

  const alertType = (props.status === 201) ? 'success': "danger";

  return (
    <Alert variant={alertType}>
      <p>{props.message}</p>
    </Alert>
  );
}

export default AlertDismissible;