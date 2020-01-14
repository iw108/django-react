
import React, { Component } from "react";

import axios from "axios";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FileDropZone from "./Dropzone";
import FileTable from "./Table";

import AlertDismissible from "./Alert";

const uuid = require('uuid/v4');


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
    this.handleFileDelete = this.handleFileDelete.bind(this);
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

  handleFileDelete (inputIndex) {
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
      .then(resp => {

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
            initialValues,
            touched,
            errors,
          }) => (

          <Form noValidate onSubmit={handleSubmit}>

            {console.log(initialValues)}

            {message.status && (
              <AlertDismissible
                status={message.status}
                message={message.message}
              />
            )}

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.description && errors.description}
                placeholder="Description"/>
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId={"formUpload"}>
              <Form.Label> Uploads </Form.Label>
                <div className={"card card-body"}>
                  <div className={"container"}>
                    <div className={"row justify-content-center"}>
                        <FileDropZone
                          multiple={true}
                          formId={initialValues.formId}
                          handleDrop={this.handleDrop}
                          handleUploadProgress={this.handleUploadProgress}
                          handleUploadSuccess={(fileIndex) => {
                            this.handleUploadSuccess(fileIndex);
                            setFieldValue('uploadCount', values.uploadCount + 1);
                          }}
                        />
                    </div>

                    <div className={"row"}>
                      <div className={"col-12"}>
                          <FileTable
                            fileList={fileList}
                            handleFileDelete={(fileIndex) =>{
                              this.handleFileDelete(fileIndex);
                              setFieldValue('uploadCount', values.uploadCount - 1);
                            }}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              <div className={"invalid"}>{touched.uploadCount && errors.uploadCount}</div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={fileList.filter(({progress}) => (progress < 100)).length > 0}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}


export default FileForm;