import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import FileForm from "./Form";
import FileForm from "./FormikUploader"
import './App.css';

// import 'typeface-roboto';


const App = () => (
  <div className="App">
    <div className={"container"}>
      <FileForm />
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));