
import React, { Component } from "react";

import axios from "axios";
import * as Yup from 'yup';
import {v4 as uuid} from 'uuid';

import {FormGroup, FormControl, FormControlLabel, Switch} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {Upload} from "tus-js-client";


import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Collapse from '@material-ui/core/Collapse';


import Uploader from './Uploader';
import SingleSelect from "./SingleSelect";
import DescriptionField from "./DescriptionField";
import ContainerNameField from "./ContainerNameField";
import Switches from "./Switches";
import FormStepper from './Stepper'
import TransferList from './UserSelection'



import { _parseObject } from "./utils"
import { organizations, projects } from "./data";


const formSchema = Yup.object().shape({
  description: Yup.string()
    .max(3),
  encrypt: Yup.boolean(),
  container: Yup.boolean(),
  containerName: Yup.string()
    .max(10),
});


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
      marginBottom: theme.spacing(2),
    },
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
  parent: {
    textAlign:'left',
    width: 400,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
});


class UploadForm extends Component {

  state = {
    step: 0,
    fileList: [],
    settingsExpanded: false,
    recommendationDismissed: false,
    duplicateFiles: false,

    formControl: {
      values: {
        formId: uuid(),
        project: "",
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

  handleExpansion = () => {
    this.setState(prevState => {
      return {
        prevState,
        settingsExpanded: !prevState.settingsExpanded,
        recommendationDismissed: (
          prevState.recommendationDismissed || (prevState.fileList.length >= 3)
        )
      }
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

    const fileNames = this.state.fileList.map(({upload}) => upload.file.path);

    const newFiles = acceptedFiles
      .filter(file => !fileNames.includes(file.path))
      .map(file => this.handleFileUpload(file));


    this.setState(prevState => {
      let updatedState = {
        ...prevState,
        fileList: prevState.fileList.concat(newFiles),
        duplicateFiles: newFiles.length !== acceptedFiles.length,
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

    const { duplicateFiles, fileList, step, formControl } = this.state;
    const { classes } = this.props;

    return (

    <div className={classes.parent}>
      <FormStepper classname={classes.stepper} step={step}/>

      <form className={classes.root} noValidate onSubmit={this.handleSubmit}>
        {step === 0 && (
          <FormControl>

              <SingleSelect
                inputOptions={organizations}
                label={"Choose an Organization"}
              />

              <SingleSelect
                inputOptions={projects}
                label={"Choose a project"}
              />

              <FormControlLabel
                label="Send to all project members"
                control={
                  <Switch
                    color="primary"
                    value="container"
                    checked={true}
                    onChange={() => {console.log('hellllloo')}}
                  />
                }
              />

             <TransferList />

          </FormControl>
        )}
        {step === 1 && (
          <React.Fragment>
            {duplicateFiles && (
              <div>
                {"You can't upload multiple files with the same name. Please rename the file and try again"}
              </div>
            )}
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
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItem
                  button
                  onClick={this.handleExpansion}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Optional Settings" />
                  {this.state.settingsExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </List>

              <Collapse in={this.state.settingsExpanded} timeout="auto" unmountOnExit>
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
              </Collapse>
            </div>

          </React.Fragment>
        )}

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
      </form>

    </div>
    );
  }
}

export default withStyles(styles)(UploadForm);