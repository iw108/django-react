
import React, { Component } from 'react';

import PropTypes from "prop-types";
import ProgressBar from 'react-bootstrap/ProgressBar';


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
      <button
        onClick={this.handleClick}
        className="btn btn-danger btn-sm"
        type={"button"}
      >
        Delete
      </button>
    )
  }
}

function UploadProgress (props) {
  return (
    <ProgressBar style={{width:"200px"}} now={props.progress} />
  )
}

function FileRow (props) {

  const {index, name, progress, url, handleDelete} = props;

  return (
    <React.Fragment>
      <td>{name}</td>
      <td>
        <UploadProgress progress={progress}/>
      </td>
      {progress === 100 && (
        <td>
          <DeleteButton
            index={index}
            url={url}
            handleDelete={handleDelete} />
        </td>
        )}
    </React.Fragment>
  )
}

function Table (props) {

  const {fileList, handleUploadDelete} = props;

  return (
    <table className={"table"}>
      {fileList.length > 0 && (
        <thead>
          <tr>
           <th colSpan={2}/>
           <th> delete all </th>
          </tr>
        </thead>
      )}

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

Table.propTypes = {
  fileList: PropTypes.array.isRequired,
  handleUploadDelete: PropTypes.func.isRequired
};


export default Table;