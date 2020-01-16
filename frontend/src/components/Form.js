
import React, { Component } from "react";

import axios from "axios";
import { Formik } from 'formik';
import * as Yup from 'yup';

import {v4 as uuid} from 'uuid';

import { FormControl, FormControlLabel, FormGroup, Switch, TextField} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import {Upload} from "tus-js-client";

import Uploader from './Uploader';
import FormButton from "./FormButton";


const formSchema = Yup.object().shape({
  description: Yup.string()
    .max(10),
  uploadCount: Yup.number()
    .min(1, "Please upload a file")
    .max(3)
    .required('Please upload a file'),
  encrypt: Yup.boolean(),
  container: Yup.boolean(),
  containerName: Yup.string()
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

const getInitialValues = () => ({
  formId: uuid(),
  description: "",
  uploadCount: 0,
  encrypted: false,
  container: false,
  containerName: "",
});


const styles = theme => ({
  root: {
    '& .MuiTextField-root': {
      width: 400,
    },
    '& > *': {
      margin: theme.spacing(2),
    },
  },
});


function EncryptionForm (props) {
  const {values, setValues, handleChange, handleBlur} = props;
  return (
    <React.Fragment>
      <div>
        <FormControl component={"fieldset"} justify={"center"}>
          <FormGroup aria-label="position" row >
          <FormControlLabel
            label="Container"
            control={
              <Switch
                color="primary"
                value="container"
                checked={values.container}
                onChange={() => {
                  let updatedValues = {
                    ...values,
                    container: !values.container,
                  };
                  // if container not specified, then it should not be
                  // encrypted and should not have container name
                  if (!updatedValues.container) {
                    updatedValues.containerName = "";
                    updatedValues.encrypted = false;
                  }
                  setValues({...updatedValues});
                }}
              />
            }
          />

          <FormControlLabel
            label="Encrypt"
            control={
              <Switch
                color="primary"
                value="encrypt"
                checked={values.encrypted}
                onChange={() => {
                  let updatedValues = {
                    ...values,
                    encrypted: !values.encrypted,
                  };
                  // if encrypted specified then it should also
                  // be a container
                  if (updatedValues.encrypted) {
                    updatedValues.container = true;
                  }
                  setValues(updatedValues)
                }}
              />
            }
            />

         </FormGroup>
       </FormControl>
      </div>

      <div>
        <TextField
          // error={(touched.description && errors.description)}
          name="containerName"
          value={values.containerName}
          onChange={handleChange}
          onBlur={handleBlur}
          variant={"outlined"}
          label="Container Name"
          disabled={!values.container}
          required={values.container}
        />
      </div>
    </React.Fragment>
  )
}


class FileForm extends Component {

  state = {
    fileList: [],
    formId: uuid(),
    step: 1,
    message: {
      status: "",
      message: "",
    },
  };

  nextStep() {
    this.setState({ step: Math.min(this.state.step + 1, 2) })
  }

  previousStep() {
    this.setState({ step: Math.max(this.state.step - 1, 1) })
  }


  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleUploadDelete = this.handleUploadDelete.bind(this);

    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);

  }

  handleDrop (acceptedFiles, rejectedFiles) {
      const fileList = acceptedFiles.map(file => (
        this.handleFileUpload(file)
      ));

      this.setState(prevState => {
        return {
          fileList: prevState.fileList.concat(fileList)
        }
    });
  }

  handleFileUpload(file) {
    // ensure that file has

    const {formId} = this.state;

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
  }

  handleUploadSuccess (fileIndex) {
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
  }

  handleUploadProgress(bytesUploaded, bytesTotal, fileIndex) {

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
  }

  handleUploadDelete (inputIndex) {
      this.setState(prevState => ({
          ...prevState,
          fileList: prevState.fileList.filter(({index}) => (index !== inputIndex))
        })
      )
  }

  handleSubmit(values, {resetForm}) {
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
  }

  render () {

    const { fileList, step } = this.state;
    const { classes } = this.props;

    return (

      <Formik
        validationSchema={formSchema}
        onSubmit={this.handleSubmit}
        initialValues={getInitialValues()}
      >
        {({
            handleSubmit,
            handleChange,
            handleBlur,
            setValues,
            setFieldValue,
            values,
            touched,
            errors,
          }) => (


          <form className={classes.root} noValidate onSubmit={handleSubmit}>

            {step === 1 && (
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
                  <TextField
                    error={(touched.description && errors.description)}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant={"outlined"}
                    label="Description"
                    required
                  />
                </div>

                {/*<div>*/}
                {/*  <FormButton*/}
                {/*    type={"button"}*/}
                {/*    disabled={fileList.filter(({progress}) => (progress < 100)).length > 0}*/}
                {/*    text={"Next"}*/}
                {/*    handleClick={this.nextStep}*/}
                {/*  />*/}
                {/*</div>*/}
          {/*    </React.Fragment>*/}
          {/*    )*/}
          {/*  }*/}

          {/*{step === 2 && (*/}
          {/*  <React.Fragment>*/}
              <div>
                <EncryptionForm
                  values={values}
                  setValues={setValues}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </div>

              <div>
                <FormButton
                  type={"button"}
                  text={"Back"}
                  handleClick={this.previousStep}
                />
              </div>
            </React.Fragment>
           )}
          </form>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(FileForm);