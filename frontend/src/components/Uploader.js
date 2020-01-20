
import React from "react";

import FileDropZone from "./Dropzone";
import SimpleTable from "./MaterialTable";


function Uploader (props) {
  return (
    <div className="card card-body">
      <div className={"container"}>
        <div className={"row justify-content-center"}>
            <FileDropZone
              multiple={true}
              handleDrop={props.handleDrop}
            />
        </div>

        <div className={"row"}>
          <div className={"col-12"}>
              <SimpleTable
                fileList={props.fileList}
                handleDelete={props.handleUploadDelete}
              />
          </div>
        </div>
      </div>
    </div>
  )
}


export default Uploader;


