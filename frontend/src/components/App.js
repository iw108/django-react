import React, { Component } from 'react';
import ReactDOM from 'react-dom';


import FileForm from "./Form";
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Basic from "./my-dropzone";


const App = () => (
  <div className="App">

    <div className={"container"}>
      <FileForm />
    </div>

  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));