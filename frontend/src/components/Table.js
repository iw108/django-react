
import React, { Component } from 'react';

import PropTypes from "prop-types";
import { Button, CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';




class DeleteButton extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
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
  }

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


function DeleteAll() {
  return (
    <Tooltip title="Delete all">
      <IconButton
        aria-label="delete"
        size={"medium"}
      >
        <ClearIcon />
      </IconButton>
    </Tooltip>
  )
}


function UploadProgress (props) {

  return (
    <CircularProgress
      size={24}
      variant={"static"}
      value={parseInt(props.progress)}
    />
  )
}

function FileRow (props) {

  const {index, name, progress, url, handleDelete} = props;

  return (
    <React.Fragment>
      <td>{name}</td>

      {progress === 100 && (
        <td>
          <DeleteButton
            index={index}
            url={url}
            handleDelete={handleDelete} />
        </td>
      )}
      {progress !== 100 && (
        <td>
          <UploadProgress
            progress={progress}
          />
        </td>
      )}

    </React.Fragment>
  )
}


function FileTable (props) {

  const {fileList, handleUploadDelete} = props;

  return (

    <table className={"table"}>
      {/*{fileList.length > 0 && (*/}
      {/*  <thead>*/}
      {/*    <tr>*/}
      {/*     <th />*/}
      {/*     <th >*/}
      {/*       <DeleteAll />*/}
      {/*     </th>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*)}*/}

      <tbody>
        {fileList.map(file => (
          <tr key={file.index}>
            <FileRow
              index={file.index}
              name={file.upload.file.path}
              progress={file.progress}
              url={file.upload.url}
              handleDelete={handleUploadDelete}
            />
          </tr>
          )
        )}
      </tbody>
    </table>
  )
}

FileTable.propTypes = {
  fileList: PropTypes.array.isRequired,
  handleUploadDelete: PropTypes.func.isRequired
};


export default FileTable;