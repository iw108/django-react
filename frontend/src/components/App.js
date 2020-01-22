import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import UploadForm from "./UploadForm"
import './App.css';

// import 'typeface-roboto';


const App = () => (
  <div className="App">
    <div className={"container"}>
      <UploadForm />
    </div>
  </div>
);

export default App;

