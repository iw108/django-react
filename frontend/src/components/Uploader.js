
import React from "react";

import FileDropZone from "./Dropzone";
import SimpleTable from "./MaterialTable";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles({
  card: {
    minWidth: 400,
  },
});

function Uploader (props) {

  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
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


