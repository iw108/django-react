
import React, { Component } from 'react';
import { Upload } from "tus-js-client";

import ProgressBar from 'react-bootstrap/ProgressBar';
import Dropzone from 'react-dropzone';

const uuid = require('uuid/v4');


class Basic extends Component {

  state = {
    fileList: [],
    formId: 'hellllo',
  };

  handleSuccess (fileIndex) {
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

  handleProgress (bytesUploaded, bytesTotal, fileIndex) {
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

  handleUpload(file) {
    // ensure that file has
    const {formId} = this.state;

    console.log(file);

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
          this.handleProgress(bytesUploaded, bytesTotal, index)
        },
        onSuccess: () => this.handleSuccess(index)
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

  handleDrop (acceptedFiles) {

    const fileList = acceptedFiles.map(file => this.handleUpload(file));

    this.setState(prevState => {
      return {
        fileList: prevState.fileList.concat(fileList)
      }
    });
  }

  handleFileDelete (inputIndex) {

      const {fileList} = this.state;

      let file = fileList.filter(({index}) => (inputIndex === index));

      if ( file.length === 1 ) {
        let fileObj = file[0];
        let url = fileObj.upload.url;

        const xhr = new window.XMLHttpRequest();
        xhr.open("DELETE", url);

        xhr.onload = () => {
          if (xhr.status === 204) {
            console.log('deleted');
            this.setState(prevState => ({
                ...prevState,
                fileList: prevState.fileList.filter(({index}) => (index !== inputIndex))
              })
            );
          } else {
            console.log('something went wrong');
          }
        };

        xhr.setRequestHeader("Tus-Resumable", "1.0.0");
        xhr.send(null)
      } else {
        console.log('File already deleted')
      }
  }

  render () {
    const {fileList} = this.state;

    return (
      <div className={"container"}>
        <div className={"row"}>
          <div className="col-2">
            <Dropzone multiple={true} onDrop={this.handleDrop.bind(this)}>
              {({getRootProps, getInputProps}) => (
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()}/>
                    <div className={"img-container"}>
                      <img alt="upload cloud" src={"static/cloud-upload-thin.svg"} width="50%"></img>
                    </div>
                  </div>
              )}
            </Dropzone>
          </div>


            <div className={"col-10"}>
              <div style={{height:'400px', 'overflowY': 'auto'}}>
                <table className={"table"}>
                  {fileList.length > 0 && (
                    <thead>
                      <tr>
                       <th></th>
                       <th></th>
                       <th> delete all </th>
                      </tr>
                    </thead>
                  )}

                  <tbody>
                    {fileList.map(file => (
                      <tr key={file.index}>
                        <td>{file.upload.file.path}</td>
                        <td> <ProgressBar style={{width:"200px"}} now={file.progress} /> </td>
                        <td>
                          {file.success && (
                            <button
                              onClick={this.handleFileDelete.bind(this, file.index)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

        </div>
      </div>
    )
  }
}

export default Basic;