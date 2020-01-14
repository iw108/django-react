
import React from "react";

import axios from "axios";
import { Formik } from 'formik';
import * as Yup from 'yup';

import {v4 as uuid} from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Button} from '@material-ui/core';


import Uploader from './Uploader';


const formSchema = Yup.object().shape({
  formId: Yup.string()
    .required(),
  description: Yup.string()
    .max(10)
    .required('This field is required'),
  uploadCount: Yup.number()
    .min(1, "Please upload a file")
    .max(3)
    .required('Please upload a file')
});


const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);


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



class FileForm extends React.Component {

  state = {
    fileList: [],
    message: {
      status: "",
      message: "",
    },
  };

  constructor (props) {
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleUploadDelete = this.handleUploadDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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

  handleUploadProgress (bytesUploaded, bytesTotal, fileIndex) {

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

  handleDrop (fileList) {
    this.setState(prevState => {
      return {
        fileList: prevState.fileList.concat(fileList)
      }
    });
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

    const data = _parseObject(values);
    axios
      .post(
        "/api/file-form/",
        data,
      )
      .then(() => {
        resetForm(getInitialValues());
        this.setState(prevState => {
          return {
            ...prevState,
            fileList: [],
            message: {
              status: 201,
              message: 'success!!!',
            }
          }
        })
      })
      .catch(err => {
        console.log('Something went wrong', err.response.data)
      })
  }

  render () {

    const { fileList, message } = this.state;

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
            setFieldValue,
            values,
            initialValues: {formId},
            touched,
            errors,
          }) => (
          <form className={classes.root} noValidate onSubmit={handleSubmit}>

            {/*{message.status && (*/}
            {/*  <AlertDismissible*/}
            {/*    status={message.status}*/}
            {/*    message={message.message}*/}
            {/*  />*/}
            {/*)}*/}

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

            <div>
              <FormControl>
                <div className="card card-body">
                    <Uploader
                      multiple={true}
                      formId={formId}
                      handleDrop={this.handleDrop}
                      handleUploadProgress={this.handleUploadProgress}
                      handleUploadSuccess={this.handleUploadSuccess}
                      handleUploadDelete={this.handleUploadDelete}
                      fileList={fileList}
                    />
                  </div>
                {/*<div className={"invalid"}>{touched.uploadCount && errors.uploadCount}</div>*/}
              </FormControl>
            </div>

          <div>
            <Button
              variant={"contained"}
              color="primary"
              type="submit"
              onClick={() => setFieldValue('uploadCount', fileList.length)}
              disabled={fileList.filter(({progress}) => (progress < 100)).length > 0}
            >
              Submit
            </Button>
          </div>
          </form>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(FileForm);