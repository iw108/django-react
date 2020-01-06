import React, { Component } from "react";
import PropTypes from "prop-types";


class Form extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };

  state = {
    name: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name } = this.state;
    const organization = { name };
    const conf = {
      method: "post",
      body: JSON.stringify(organization),
      headers: new Headers({ "Content-Type": "application/json" })
    };

    fetch(this.props.endpoint, conf)
        .then(response => {
          this.setState({'name': ""})});
  };

  render() {
    const { name } = this.state;
    return (
      <div className="card card-body">
        <h2> Create Organization </h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="organizationName">Name</label>
            <input
              className="form-control"
              id="organizationName"
              type="text"
              name="name"
              placeholder="Enter a name"
              onChange={this.handleChange}
              value={name}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
           Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Form;