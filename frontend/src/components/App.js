import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import DataProvider from "./DataProvider";
import Table from "./Table";
import Form from "./Form";
import './App.css';

import Basic from "./my-dropzone";


const App = () => (
  <div className="App">
    <div className="container">
      <div className={"card card-body"}>
        <Basic />
      </div>
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));