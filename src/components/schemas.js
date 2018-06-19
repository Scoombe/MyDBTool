import React from "react";
import PropTypes from "prop-types";

export default class Schemas extends React.Component {
    constructor(props) {
        super(props);
        this.shuffleSchemas = this.shuffleSchemas.bind(this);
    }

    shuffleSchemas(e) {
        this.props.clearError('', 'MissingSchema');
        this.props.onSchemaChange(this.props.index, e.target.value);
    }

    render() {
        return (
            <select className="custom-select dropdown" style={{paddingLeft: 10}}
                    onChange={this.shuffleSchemas} defaultValue="Select Schema">
                <option className="dropdown-item" disabled="true">Select Schema</option>
                {this.props.schemas.map((eachSchema) => {
                    return <option className="dropdown-item" key={eachSchema}> {eachSchema} </option>
                })}
            </select>
        )
    }
}


Schemas.propTypes = {
    schemaSelect: PropTypes.string,
    onSchemaChange: PropTypes.func.isRequired,
    schemas: PropTypes.array.isRequired
};