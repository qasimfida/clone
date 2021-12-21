
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormContext } from './Form';
import { API } from '../../../Lib/Api/Api';
import { defaultValidator } from './FormValidators';
import { CheckBox } from '../Inputs/CheckBox/CheckBox';
import { toCamelCase } from '../../../Lib/Common/jsonHelpers';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';



export const InputTypes = {
    Text: 'text',
    Textarea: 'textarea',
    Number: 'number',
    Select: 'select',
    Date: 'date',
    Bool: 'bool',
    DateTime: 'datetime',
    Password: 'password',
    JSON: 'JSON',
    Currency: 'Currency'
};


const prepareSelectValues = (values, defaultValue) => {
    if (!values) return;
    if (values && !Array.isArray(values)) {
        return Object.keys(values).map(key => {
            return <option key={key} value={key} selected={defaultValue?.toString() == key.toString()}>{values[key]}</option>;
        });
    }

    if (!values) return;
    if (!defaultValue) defaultValue = '';

    return values.map(x => {
        try {
            return <option key={x} value={x.id} selected={defaultValue?.toString() == x.id.toString()}>{x.title}</option>;
        } catch (err) {
            return <option>option render error</option>;
        }
    });
};

export const FormInput = (props) => {
    var component = null;
    var formContext = null;
    var inputRef = null;

    var field = Object.assign({}, props);

    const [dataValues, setDataValues] = useState(null);
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        var value = formContext ? formContext.getData(field) : null;
        if (!value) value = field.value;

        if (props.endpoint) {
            API.post(props.endpoint, {}, null, null).then((result) => {
                var results = [];
                result.result.map(x => {
                    x = toCamelCase(x);
                    results.push({ id: x.Id, title: x.Name });
                });

                setDataValues(results);
            });
        }
        if (inputRef) {
            inputRef.value = value ? value : field.value;
        }
        field.target = inputRef;
        if (formContext) formContext.addField(field);
    }, []);

    const onChangeCapture = (e) => {
        const result = defaultValidator(field, e.target);

        if (result != null) {
            e.preventDefault();
            return;
        }

        if (formContext) formContext.update(field, e.target);
        props.onChange(field, e.target, e.target.value);
    };

    const onKeyUp = (e) => {
        props.onKeyUp(props, e);
    };

    switch (props.type) {
        case InputTypes.Select:
            var values = prepareSelectValues(dataValues ? dataValues : props.values, props.value);
            component = <select
                ref={(r) => inputRef = r}
                onFocus={() => {

                }}
                onBlur={() => {

                }}
                onChangeCapture={onChangeCapture.bind(this)} >
                {props.nullable && <option value={'null'}>All</option>}
                {values}
            </select>;
            break;
        case InputTypes.Textarea:
            component = <textarea
                ref={(r) => inputRef = r}
                onFocus={() => {

                }}
                onBlur={() => {

                }}
                onChangeCapture={onChangeCapture.bind(this)}
                onKeyUp={onKeyUp.bind(this)} />;
            break;
        case InputTypes.Bool:
            component = <CheckBox ref={(r) => inputRef = r} checked={props.value} onClick={(checked) => {
                onChangeCapture({
                    target: {
                        value: checked
                    }
                });
            }} />;
            break;
        case InputTypes.Text:
        case InputTypes.Number:
        case InputTypes.Password:
        default:
            var type = props.type;
            if (type == InputTypes.DateTime) {
                type = 'datetime-local';
                component = <DatePicker
                    ref={(r) => inputRef = r}
                    name={props.name}
                    selected={value}
                    dateFormat="d MMMM, yyyy h:mm aa"
                    onChange={(date) => {
                        setValue(date);
                        if (formContext) formContext.update(field, { value: date });
                        props.onChange(field, inputRef, date);
                    }}
                />;
            } else {
                component = <input type={type}
                    ref={(r) => inputRef = r}
                    readOnly={props.readonly}
                    onFocus={() => {

                    }}
                    onBlur={() => {

                    }}
                    onChangeCapture={onChangeCapture.bind(this)}
                    onKeyUp={(e) => props.onKeyUp(props, e)} />;
            }
    }

    return <FormContext.Consumer>
        {
            (context) => {
                formContext = context;
                const classList = ['form-group', props.className];
                const error = context != null ? context.getError(field.name) : null;
                if (error) classList.push('error');
                return <div className={classList.join(' ')} >
                    {props.title && <label htmlFor={props.name} className={props.onLabelClick ? 'clickable' : ''} onClick={() => props.onLabelClick ? props.onLabelClick() : null}>{props.title}</label>}
                    {component}
                    {props.children}
                    {error && <div className='error'>
                        {error.error}
                    </div>
                    }
                </div>;
            }
        }
    </FormContext.Consumer>;
};

FormInput.defaultProps = {
    type: 'text',
    required: false,
    min: 0,
    max: 1,
    value: null,

    onKeyUp: () => { },
    onChange: () => { }

};

FormInput.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
    min: PropTypes.any,
    max: PropTypes.any,

    nullable: PropTypes.bool,

    readonly: PropTypes.bool,

    children: PropTypes.node,

    values: PropTypes.any,
    value: PropTypes.any,
    endpoint: PropTypes.string,



    onKeyUp: PropTypes.func,
    onChange: PropTypes.func,

    onLabelClick: PropTypes.func
};
