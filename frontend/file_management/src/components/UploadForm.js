
import React, { Component } from "react";

import axios from "axios";
import {v4 as uuid} from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {Upload} from "tus-js-client";

import Uploader from './Uploader';
import FormStepper from './Stepper'

import { _parseObject } from "./utils"


const styles = theme => ({
  root: {
    textAlign: 'left',
    width: 400,
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
});


class UploadForm extends Component {

  state = {
    step: 0,
    fileList: [],
    duplicateFiles: false,
    formId: uuid(),
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
      return updatedState;
    });
  };

  handleFileUpload = (file) => {
    // ensure that file has

    const formId = this.state.formId;

    let index = uuid();

    let upload = new Upload(file, {
        endpoint: "/upload/",
        chunkSize: 2000000,
        metadata: {
          formId: formId,
          filename: file.name,

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
    const { duplicateFiles, fileList, step } = this.state;
    const { classes } = this.props;

    return (

    <div className={classes.root}>
      <FormStepper step={step}/>

      <form noValidate onSubmit={this.handleSubmit}>
        {duplicateFiles && (
          <div>
            <Typography>
            {"You can't upload multiple files with the same name. Please rename the file and try again"}
            </Typography>
          </div>
        )}

        {step === 0 && (
          <div>
            <Uploader
              handleDrop={this.handleDrop}
              fileList={fileList}
              handleUploadDelete={this.handleUploadDelete}
            />
          </div>
        )}

        <div className={classes.buttonGroup}>
          <Button
            disabled={step === 0}
            onClick={this.handleBack}
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