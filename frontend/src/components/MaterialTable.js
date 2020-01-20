
import React, { Component } from 'react';

import { CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function UploadProgress (props) {

  return (
    <CircularProgress
      size={24}
      variant={"static"}
      value={parseInt(props.progress)}
    />
  )
}

class DeleteButton extends Component {

  handleClick = () => {
    let {index, url} = this.props;

    const xhr = new window.XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.onload = () => {
      if (xhr.status === 204) {
        console.log('deleted');
      } else {
        console.log('something went wrong');
      }
    };

    xhr.setRequestHeader("Tus-Resumable", "1.0.0");
    xhr.send(null);

    this.props.handleDelete(index)
  };

  render() {
    return (
      <IconButton
        aria-label="delete"
        onClick={this.handleClick}
        size={"small"}
      >
        <ClearIcon />
      </IconButton>
    )
  }
}

export default function SimpleTable({fileList, handleDelete}) {

  // const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableBody>
          {fileList.map(file => (
            <TableRow key={file.index}>
              <TableCell component="th" scope="row">
                {file.upload.file.path}
              </TableCell>
              <TableCell align="right">
                {file.progress === 100 ? (
                  <DeleteButton
                    index={file.index}
                    url={file.upload.url}
                    handleDelete={handleDelete}
                  />
                  ):(
                    <UploadProgress progress={file.progress}/>
                    )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

