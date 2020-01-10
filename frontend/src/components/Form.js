
import React, { Component } from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import FileDropZone from "./Dropzone";
import FileTable from "./Table";


const uuid = require('uuid/v4');


const formSchema = Yup.object().shape({
  description: Yup.string()
    .max(10)
    .required('This field is required'),
  uploads: Yup.number()
    .min(1, "Please upload a file")
    .max(3)
    .required('Please upload a file')
});


const initialValues = {
  description: "",
  uploads: 0,
};


class FileForm extends React.Component {

  state = {
    fileList: [],
    formId: uuid(),
  };

  constructor (props) {
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleFileDelete = this.handleFileDelete.bind(this)

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

  render () {

    const { fileList } = this.state;

    return (
      <Formik
        validationSchema={formSchema}
        onSubmit={values => {
          console.log(values);
        }}
        initialValues={initialValues}
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

          <Form noValidate onSubmit={handleSubmit}>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.description && !errors.description}
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
                    <div className={"row"}>
                      <div className="col-2">
                        <FileDropZone
                          multiple={true}
                          handleDrop={this.handleDrop}
                          handleUploadProgress={this.handleUploadProgress}
                          handleUploadSuccess={(fileIndex) => {
                            this.handleUploadSuccess(fileIndex);
                            setFieldValue('uploads', values.uploads + 1);
                          }}
                        />
                      </div>

                      <div className={"col-10"}>
                        <div style={{height:'400px', 'overflowY': 'auto'}}>
                          <FileTable
                            fileList={fileList}
                            handleFileDelete={(fileIndex) =>{
                              this.handleFileDelete(fileIndex);
                              setFieldValue('uploads', values.uploads - 1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              <div className={"invalid"}>{touched.uploads && errors.uploads}</div>
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
};


export default FileForm;