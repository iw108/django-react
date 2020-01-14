
import React from "react";

import FileDropZone from "./Dropzone";
import FileTable from "./Table";


function Uploader(props) {
  return (
    <div className={"container"}>
      <div className={"row justify-content-center"}>
          <FileDropZone
            multiple={true}
            formId={props.formId}
            handleDrop={props.handleDrop}
            handleUploadProgress={props.handleUploadProgress}
            handleUploadSuccess={props.handleUploadSuccess}
          />
      </div>

      <div className={"row"}>
        <div className={"col-12"}>
            <FileTable
              fileList={props.fileList}
              handleUploadDelete={props.handleUploadDelete}
            />
        </div>
      </div>
    </div>
  )
}

export default Uploader;


