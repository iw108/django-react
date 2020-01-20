
import React, { Component } from "react";

import axios from "axios";
import * as Yup from 'yup';
import {v4 as uuid} from 'uuid';

import { FormGroup, FormControl, FormControlLabel, Switch, TextField} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {Upload} from "tus-js-client";

import Uploader from './Uploader';

import Button from '@material-ui/core/Button';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';

import HorizontalLabelPositionBelowStepper from './Stepper'


const formSchema = Yup.object().shape({
  description: Yup.string()
    .max(3),
  encrypt: Yup.boolean(),
  container: Yup.boolean(),
  containerName: Yup.string()
    .max(10),
});


const camelToSnakeCase = str => (
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
);

const _parseObject = obj => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [camelToSnakeCase(key), value];
    })
  );
};

const getInitialValues = () => {
  return {
  formId: uuid(),
  description: "",
  encrypted: false,
  container: false,
  containerName: "",
}};


const styles = theme => ({
  root: {
    '& .MuiTextField-root': {
      width: 400,
    },
    '& > *': {
      margin: theme.spacing(2),
    },
    '& .MuiExpansionPanel-root': {
      width: 400,
    },
  },
  parent: {
    textAlign:'left',
    width: 450,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
});

function ContainerNameField ({value, touched, error, handleChange, encrypted, required}) {

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
          style={{width: 350}}
          fullwidth={true}
        />
      </div>
    </React.Fragment>
  )
}


function Switches({encrypt, container, handleSwitch}) {
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

function DescriptionField ({value, touched, error, handleChange}) {
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


class FileForm extends Component {

  state = {

    step: 0,
    fileList: [],
    settingsExpanded: false,
    recommendationDismissed: false,

    formControl: {
      values: {
        formId: uuid(),
        description: "",
        encrypt: false,
        container: false,
        containerName: "",
      },
      touched: {
        description: false,
        encrypt: false,
        container: false,
        containerName: false,
      },
      errors: {
        description: undefined,
        encrypt: undefined,
        container: undefined,
        containerName: undefined,
      },
    },
    message: {
      status: "",
      message: "",
    },
  };

  handleNext = () =>  {
    this.setState({
      step: Math.min(this.state.step + 1, 2)
    })
  };

  handleBack = () => {
    this.setState({
      step: Math.max(this.state.step - 1, 0)
    })
  };

  validateField = (field, value) => {
    Yup.reach(formSchema, field).validate(value)
      .then(() => undefined)
      .catch(error => error.message)
      .then(message => {
        this.setState(prevState => {
          const {formControl} = prevState;
          formControl.errors = {
            ...formControl.errors,
            [field]: message,
          };
          return {
            ...prevState,
            formControl: formControl
          }
        });
      })
  };

  handleSwitch = event => {

    const field = event.target.value;

    this.setState(prevState => {
      const {formControl: {errors, values, touched}} = prevState;

      const updatedValues = {
        ...values,
        [field]: !(values[[field]])
      };

      // if container has been switched off, make sure
      // that the container name fields are cleaned
      if (!updatedValues.container) {
        const fieldName = "containerName";
        updatedValues[fieldName] = "";
        touched[fieldName] = false;
        errors[fieldName] = undefined;
      }

      return {
        ...prevState,
        formControl: {
          values: updatedValues,
          touched: touched,
          errors: errors,
        }
      };
    })
  };

  handleChange = event => {

    const field = event.target.name;
    const value = event.target.value;

    this.validateField(field, value);

    this.setState(prevState => {
      const {formControl: {errors, values, touched}} = prevState;
      const updatedFormControl = {
        values: {
          ...values,
          [field]: value
        },
        touched: {
          ...touched,
          [field]: true,
        },
        errors: errors,
      };

      return {
        ...prevState,
        formControl: updatedFormControl
      }
    })
  };

  handleDrop = (acceptedFiles, rejectedFiles) =>  {
      const fileList = acceptedFiles.map(file => (
        this.handleFileUpload(file)
      ));

      this.setState(prevState => {

        let updatedState = {
          ...prevState,
          fileList: prevState.fileList.concat(fileList)
        };

        if (!updatedState.recommendationDismissed && updatedState.fileList.length >= 3) {
          updatedState.settingsExpanded = true;
          updatedState.formControl.values.container = true;
        }

        return updatedState;
    });
  };

  handleFileUpload = (file) => {
    // ensure that file has

    const formId = this.state.formControl.values.formId;

    let index = uuid();

    let upload = new Upload(file, {
        endpoint: "/upload/",
        chunkSize: 2000000,
        metadata: {
          formId: formId,
          filename: file.name,
          // filetype: file.type || 'unknown',
        },
        onError: (error) => {
          console.log(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          this.handleUploadProgress(bytesUploaded, bytesTotal, index)
        },
        onSuccess: () => this.handleUploadSuccess(index)
      });

    // trigger upload
    upload.start();

    return {
      upload: upload,
      index: index,
      success: false,
      progress: 0,
    };
  };

  handleUploadSuccess = (fileIndex) => {
    this.setState((prevState) => {
      let fileList = prevState.fileList.map(file => {
        if (file.index === fileIndex) {
          file.success = true;
          file.progress = 100;
        }
        return file;
      });
      return {
        ...prevState,
        fileList: fileList,
      };
    })
  };

  handleUploadProgress = (bytesUploaded, bytesTotal, fileIndex) => {

    let percentage = (bytesUploaded / bytesTotal * 100).toFixed(0);
    this.setState((prevState) => {
      let fileList = prevState.fileList.map(file => {
        if (file.index === fileIndex) {
          file.progress = percentage;
        }
        return file;
      });
      return {
        ...prevState,
        fileList: fileList,
      };
    })
  };

  handleUploadDelete = (inputIndex) => {
      this.setState(prevState => ({
          ...prevState,
          fileList: prevState.fileList.filter(({index}) => (index !== inputIndex))
        })
      )
  };

  handleSubmit = (values, {resetForm}) => {
    // ensure form data keys are snake cased
    console.log("Submitting data");

    const dataToServer = _parseObject({
      ...values,
      formId: this.state.formId
    });

    axios
      .post(
        "/api/file-form/",
        dataToServer,
      )
      .then(() => {
        resetForm(getInitialValues());
        this.setState(prevState => (
          {
            ...prevState,
            formId: uuid(),
            fileList: [],
            message: {
              status: 201,
              message: 'success!!!',
            }
          }
        ))
      })
      .catch(err => {
        console.log('Something went wrong', err.response.data)
      })
  };

  render () {

    const { fileList, step, formControl } = this.state;
    const { classes } = this.props;

    return (

    <div className={classes.parent}>
      <HorizontalLabelPositionBelowStepper classname={classes.stepper} step={step}/>

      <form className={classes.root} noValidate onSubmit={this.handleSubmit}>

        {step < 5 && (
          <React.Fragment>
            <div>
              <FormControl>
                <Uploader
                  handleDrop={this.handleDrop}
                  fileList={fileList}
                  handleUploadDelete={this.handleUploadDelete}
                />
              </FormControl>
            </div>

            <div>
              <DescriptionField
              error={formControl.errors.description}
              touched={formControl.touched.description}
              value={formControl.values.value}
              handleChange={this.handleChange}
             />
            </div>

            <div>
              <ExpansionPanel
                expanded={this.state.settingsExpanded}
                variant={"outlined"}

                onChange={() => {
                  this.setState(prevState => {
                    return {
                      prevState,
                      settingsExpanded: !prevState.settingsExpanded,
                      recommendationDismissed: (
                        prevState.recommendationDismissed || (prevState.fileList.length >= 3)
                      )
                    }
                  })
                }}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1d-content"
                  id="panel1d-header">
                   <div>
                     <SettingsIcon /> Advanced Settings
                   </div>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                  <FormGroup className={classes.nested}>
                  <div className={classes.nested}>
                    < Switches
                      container={formControl.values.container}
                      encrypt={formControl.values.encrypt}
                      handleSwitch={this.handleSwitch}
                    />
                  </div>

                  <div>
                    <ContainerNameField
                      value={formControl.values.containerName}
                      error={formControl.errors.containerName}
                      touched={formControl.touched.containerName}
                      encrypted={formControl.values.encrypt}
                      required={formControl.values.encrypt || formControl.values.container}
                      handleChange={this.handleChange}
                    />
                  </div>
                    </FormGroup>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>

            <div>
              <Button
                disabled={step === 0}
                onClick={this.handleBack}
                className={classes.backButton}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={this.handleNext}>
                {step === 1? 'Submit': 'Next'}
              </Button>
            </div>

          </React.Fragment>
        )}
      </form>

    </div>
    );
  }
}

export default withStyles(styles)(FileForm);