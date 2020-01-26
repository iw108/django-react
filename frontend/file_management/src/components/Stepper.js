import React from 'react';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


function getSteps() {
  return ['Upload Files', 'Finish'];
}

export default function FormStepper({step}) {

  const steps = getSteps();

  return (
      <Stepper activeStep={step} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}
