import React from 'react';
import PropTypes from 'prop-types';
import { FormInput, InputTypes } from '../../Form/FormInput';

export const EditableColumn = (props) => {
    const field = props.field;
    const value = props.row[field.name];

    return <td className={`column-editable column-${field.name.toLowerCase()}`}><FormInput type={field.type} value={value} onChange={(f, target, value) => {
        if (!props.onChange) return;
        if (field.type == InputTypes.Number) value = parseFloat(value);
        if (isNaN(value)) return;
        props.onChange(field, props.row, value);
    }} /></td>;
};

EditableColumn.propTypes = {
    field: PropTypes.object,
    row: PropTypes.object,
    onChange: PropTypes.func
};