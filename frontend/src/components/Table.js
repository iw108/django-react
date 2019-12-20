import React from "react";
import PropTypes from "prop-types";
import key from "weak-key";

const Table = ({ data }) =>
  !data.length ? (
    <p>Nothing to show</p>
  ) : (
    <div className="container">
      <h2> Organizations </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            {Object.entries(data[0])
                .filter(el => (el[0] !== 'id'))
                    .map(el => <th key={key(el)}>{el[0]}</th>)
            }
          </tr>

        </thead>
        <tbody>
        {data.map(el => {
            return (
                <tr key={el.id}>
                    {Object.entries(el)
                        .filter(el => (el[0] !== 'id'))
                            .map(el => <td key={key(el)}>{el[1]}</td>)
                    }
                </tr>
            )
        })}
        </tbody>
      </table>
    </div>
  );

Table.propTypes = {
  data: PropTypes.array.isRequired
};

export default Table;