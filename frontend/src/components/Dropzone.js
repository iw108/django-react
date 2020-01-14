
import React, { Component } from 'react';

import PropTypes from "prop-types";
import Dropzone from 'react-dropzone';
import {Upload} from "tus-js-client";
import {v4 as uuid} from 'uuid'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

class FileDropZone extends Component {

  static propTypes = {
    handleDrop: PropTypes.func.isRequired,
    handleUploadProgress: PropTypes.func.isRequired,
    handleUploadSuccess: PropTypes.func.isRequired,
    multiple: PropTypes.bool.isRequired,
  };

  static defaultProps ={
    multiple: true,
  };

  constructor(props) {
    super(props);

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

    let index = uuid();

    let upload = new Upload(file, {
        endpoint: "/upload/",
        chunkSize: 2000000,
        metadata: {
          formId: this.props.formId,
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

    const customStyle = {
      className:'dropzone',
    };

    return (
      <Dropzone multiple={this.props.multiple} onDrop={this._handleDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps(customStyle)}>
            <input {...getInputProps()}/>
            <div className={"img-container"}>
              <figure>
                <ControlPointIcon fontSize={"large"}/>
                <figcaption> Drop your files or click here</figcaption>
              </figure>
            </div>
          </div>
        )}
      </Dropzone>
    )
  }
}

export default FileDropZone;