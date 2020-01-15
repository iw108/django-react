
import React from "react";

import axios from "axios";
import { Formik } from 'formik';
import * as Yup from 'yup';

import {v4 as uuid} from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import { FormControl, FormControlLabel, FormGroup, Switch, TextField, Button} from '@material-ui/core';

import BaseUploader from './Uploader';


const formSchema = Yup.object().shape({
  formId: Yup.string()
    .required(),
  description: Yup.string()
    .max(10),
  uploadCount: Yup.number()
    .min(1, "Please upload a file")
    .max(3)
    .required('Please upload a file'),
  encrypt: Yup.boolean(),
  container: Yup.boolean(),
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
  encrypted: false,
  container: false,
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



class FileForm extends BaseUploader {

  state = {
    fileList: [],
    formId: uuid(),
    step: 0,
    message: {
      status: "",
      message: "",
    },
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
            touched,
            errors,
          }) => (
          <form className={classes.root} noValidate onSubmit={handleSubmit}>

            <div>
              <TextField
                error={(touched.description && errors.description)}
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                variant={"outlined"}
                label="Description of files"
              />
            </div>

            <div>
              <FormControl>
                {this._renderUploader()}
                {/*<div className={"invalid"}>{touched.uploadCount && errors.uploadCount}</div>*/}
              </FormControl>
            </div>


            <div>
             <FormControl component={"fieldset"}>
               <FormGroup>
                <FormControlLabel
                  control={<Switch color="primary" checked={values.encrypted} onChange={() => setFieldValue('encrypted', !values.encrypted)} value="encrypt" />}
                  label="Encrypt"
                />
                <FormControlLabel
                  control={<Switch color="primary" checked={values.container} onChange={() => setFieldValue('container', !values.container)} value="container" />}
                  label="Container"
                />
               </FormGroup>
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