
import React from "react";

import FileDropZone from "./Dropzone";
import FileTable from "./Table";
import {v4 as uuid} from "uuid";
import {Upload} from "tus-js-client";


class BaseUploader extends React.Component {

  state = {
    fileList: [],
    formId: uuid(),
  };

  constructor (props) {

      super(props);

      this.handleDrop = this.handleDrop.bind(this);
      this.handleFileUpload = this.handleFileUpload.bind(this);
      this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
      this.handleUploadProgress = this.handleUploadProgress.bind(this);
      this.handleUploadDelete = this.handleUploadDelete.bind(this);
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

  _renderUploader() {
      const {fileList} = this.state;

      return (
          <div className="card card-body">
            <div className={"container"}>
              <div className={"row justify-content-center"}>
                  <FileDropZone
                    multiple={true}
                    handleDrop={this.handleDrop}
                  />
              </div>

              <div className={"row"}>
                <div className={"col-12"}>
                    <FileTable
                      fileList={fileList}
                      handleUploadDelete={this.handleUploadDelete}
                    />
                </div>
              </div>
            </div>
          </div>
      )
  }
}


export default BaseUploader;


