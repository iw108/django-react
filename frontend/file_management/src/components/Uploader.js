
import React from "react";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import FileDropZone from "./Dropzone";
import SimpleTable from "./MaterialTable";


function Uploader (props) {

  return (
    <Card variant="outlined">
      <CardContent>
        <div>
          <FileDropZone
            multiple={true}
            handleDrop={props.handleDrop}
          />
        </div>

        <div>
          <SimpleTable
            fileList={props.fileList}
            handleDelete={props.handleUploadDelete}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default Uploader;


