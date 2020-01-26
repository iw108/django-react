
import React, { Component } from 'react';

import PropTypes from "prop-types";
import Dropzone from 'react-dropzone';
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import Typography from '@material-ui/core/Typography';

class FileDropZone extends Component {

  static propTypes = {
    handleDrop: PropTypes.func.isRequired,
  };

  static defaultProps ={
    multiple: true,
  };

  render() {

    const customStyle = {
      className:'dropzone',
    };

    return (
      <Dropzone multiple={this.props.multiple} onDrop={this.props.handleDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps(customStyle)}>
            <input {...getInputProps()}/>
            <div className={"img-container"}>
              <figure>
                <ControlPointIcon fontSize={"large"}/>
                <figcaption>
                  <Typography> Drop your files or click here </Typography>
                </figcaption>
              </figure>
            </div>
          </div>
        )}
      </Dropzone>
    )
  }
}

export default FileDropZone;