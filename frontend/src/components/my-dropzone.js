import React, { Component, useState } from 'react';


import {useDropzone} from 'react-dropzone';
import Dropzone from 'react-dropzone'



class Basic extends Component {

  state = {
    fileList: [],
    index: 0
  };

  handleDrop (acceptedFiles) {
    const {index} = this.state;
    const fileList = acceptedFiles.map((file, ind) => (
        {file: file, index: ind + index}
      )
    );

    this.setState(prevState => {
      return {
        index: prevState.index + fileList.length,
        fileList: prevState.fileList.concat(fileList)
      }
    });
  }

  handleFileDelete (index) {
    this.setState(prevState => ({
      ...prevState,
      fileList: prevState.fileList.filter(file => (file.index !== index))
    }))
  }

  render () {
    const {fileList} = this.state;
    return (
      <div className={"container"}>
        <div className={"row"}>
          <div className="col-2">
            <Dropzone multiple={true} onDrop={this.handleDrop.bind(this)}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()}/>
                    {/*Drag and drop files or click to select*/}
                    <div className={"img-container"}>
                      <img alt="upload cloud" src={"static/cloud-upload-thin.svg"} width="50%"></img>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          {fileList && (
            <div className={"col-10"}>
              <div style={{height:'200px', 'overflowY': 'auto'}}>
              <table className={"table"}>
                <tbody>
                  {fileList.map(file => (
                    <tr key={file.index}>
                      <td>{file.file.path}</td>
                      <td>
                        <button
                          onClick={this.handleFileDelete.bind(this, file.index)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            )}
        </div>
      </div>
    )
  }
}

export default Basic;