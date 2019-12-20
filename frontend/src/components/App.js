import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import DataProvider from "./DataProvider";
import Table from "./Table";
import Form from "./Form";


const App = () => (
    <React.Fragment>
    <div className={"container"}>
    <DataProvider
        endpoint="/api/organizations/"
        render={data => <Table data={data} />}
    />
    <Form endpoint={"api/organizations/"}/>
    </div>
    </React.Fragment>

)

ReactDOM.render(<App />, document.getElementById('app'));