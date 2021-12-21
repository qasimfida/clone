import './_form.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { defaultValidator } from './FormValidators';
import { InputTypes } from './FormInput';

export const FormContext = React.createContext();

export const Form = (props) => {
    const [formErrors, setErrors] = useState(null);
    const [formFields, setFields] = useState({});

    const formContext = {
        data: Object.assign({}, props.data ? props.data : {}),
        errors: {},
        getError: (field) => {
            if (!formErrors) return null;
            return formErrors[field];
        },
        addField: (field) => {
            formFields[field.name] = field;
            setFields(formFields);
        },
        getData: (field) => {
            if (props.data.hasOwnProperty(field.name)) {
                return props.data[field.name];
            }
        },
        submit: () => {
            return formContext.data;
        },
        update: (field, control) => {
            if (field.nullable && field.type == 'select' && control.value == 'null') {
                delete formContext.data[field.name];
                return;
            }
            delete formContext.errors[field.name];
            formContext.data[field.name] = field.type == 'number' ? parseFloat(control.value) : control.value;
            if (props.onChange) props.onChange(formContext.data);
            if (!props.context) return;
            props.context(formContext);
        }
    };

    const validate = () => {
        var errors = {};
        Object.values(formFields).map(field => {
            const error = defaultValidator(field, field.target);
            if (error) {
                errors[field.name] = error;
            } else {
                if (field.type == InputTypes.Bool) {
                    formContext.data[field.name] = field.target.getValue();
                } else {
                    if (field.target.value != '') formContext.data[field.name] = field.target.value;
                }
            }
        });
        return errors;
    };

    useEffect(() => {
        if (!props.context) return;
        props.context(formContext);
    }, []);

    return <form className={props.className} key={formErrors} onSubmit={(e) => {
        try {
            e.preventDefault();
            var errors = validate();
            if (errors && Object.keys(errors).length > 0) {
                formContext.errors = errors;
                if (props.onError) {
                    props.onError(errors);
                } else {
                    setErrors(errors);
                }
            } else {
                if (formErrors) setErrors(null);
                props.onSubmit(formContext.data);
            }
        } catch (err) {
            console.log(err);
        }
    }}>
        <FormContext.Provider value={formContext}>
            {props.children}
        </FormContext.Provider>
    </form>;
};

Form.defaultProps = {
    onSubmit: () => { },
    data: {}
};

Form.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,

    data: PropTypes.object,
    required: PropTypes.bool,

    //functions
    onSubmit: PropTypes.func,
    onError: PropTypes.func,

    onChange: PropTypes.func,

    context: PropTypes.func
};
