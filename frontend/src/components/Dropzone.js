
import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import {Upload} from "tus-js-client";

const uuid = require('uuid/v4');


class FileDropZone extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formId: uuid(),
    };

    this._handleDrop = this._handleDrop.bind(this);
    this._handleUpload = this._handleUpload.bind(this);
  }

  _handleDrop(acceptedFiles) {
    const fileList = acceptedFiles.map(file => (
      this._handleUpload(file)
    ));
    this.props.handleDrop(fileList);
  }

  _handleUpload(file) {
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
          this.props.handleUploadProgress(bytesUploaded, bytesTotal, index)
        },
        onSuccess: () => this.props.handleUploadSuccess(index)
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

  render() {

    const styleProps = {
      className: 'dropzone'
    };

    return (
      <Dropzone multiple={this.props.multiple} onDrop={this._handleDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps(styleProps)}>
            <input {...getInputProps()}/>
            <div className={"img-container"}>
              <img
                alt="upload cloud"
                src={"static/cloud-upload-thin.svg"}
                width="50%"
              />
            </div>
          </div>
        )}
      </Dropzone>
    )
    }
}

export default FileDropZone;