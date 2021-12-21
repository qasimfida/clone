import React from 'react';
import PropTypes from 'prop-types';
import { SortableHandle } from 'react-sortable-hoc';
import { Icon } from '../../Icon/Icon';
import { InputTypes } from '../Form/FormInput';
import { EditableColumn } from './Column/EditableColumn';


const SortableHandler = SortableHandle((props) => props.handle);
SortableHandler.defaultProps = {
    handle: <div className='handle'><Icon icon='grip-vertical' /></div>
};

SortableHandler.propTypes = {
    handle: PropTypes.node
};


const dateTimeFormatter = (value) => {
    if (!value) return;
    return new Date(value).toLocaleString(navigator.language, { hour12: false });
};

const dateFormatter = (value) => {
    return new Date(value).toLocaleDateString(navigator.language);
};

const jsonFormatter = (value) => {
    try {
        value = JSON.parse(value);
        return <div className='flex vertical'>
            {
                Object.keys(value).map(x => {
                    return <div className='flex' key={x}><label>{x}</label><span>{value[x]}</span></div>;
                })
            }
        </div>;
    } catch (err) {
        //
    }
};

export const TableColumn = (props) => {
    const field = props.field;
    var column = null;
    if (field.renderRow) {
        column = field.renderRow(props.row, props.field, props.context, props.footer);
    } else {
        switch (field.type) {
            case InputTypes.DateTime:
                column = dateTimeFormatter(props.row[props.field.name]);
                break;
            case InputTypes.Number:
                column = props.row[props.field.name];
                break;
            case InputTypes.Date:
                column = dateFormatter(props.row[props.field.name]);
                break;
            case InputTypes.JSON:
                column = jsonFormatter(props.row[props.field.name]);
                break;
            case InputTypes.Bool:
                column = props.row[props.field.name] == true ? 'Yes' : 'No';
                break;
            case InputTypes.Select:
                column = props.field.values[props.row[props.field.name]];
                break;
            case InputTypes.Currency:
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });

                column = formatter.format(props.row[props.field.name]);
                break;
            default:
                column = props.row[props.field.name];
        }

    }
    return <td className={`column-${field.name.toLowerCase()}`}>{column}</td>;
};

TableColumn.propTypes = {
    field: PropTypes.object,
    row: PropTypes.object,
    footer: PropTypes.bool,
    context: PropTypes.object
};


const TableRow = (props) => {
    const columns = props.model.fields.map((field, index) => {
        return field.editable ? <EditableColumn key={index} field={field} {...props} /> : <TableColumn key={index} field={field} {...props} />;
    });
    const elements = <React.Fragment>
        {props.options?.draggable?.enabled &&
            <td className='table-option-draggable-column'>
                <SortableHandler />
            </td>
        }
        {props.options?.selectable && <td className='table-option-selectable-column' onClick={() => props.onSelect(props.row)}><Icon icon={props.row.__selected ? 'check-square' : 'square'} type='far' /></td>}
        {columns}
        {props.options?.data && props.options.data?.delete?.enabled &&
            <td className='table-option-delete-column' onClick={() => {
                props.onDelete(props.row);
            }} >
                <Icon icon='times' />
            </td>
        }
        {props.buttons && <td className='table-option-buttons-column'>{props.buttons(props.row)}</td>}
    </React.Fragment>;

    if (props.onRenderRow) {
        return props.onRenderRow(props.row, elements, props.className);
    }
    return <tr className={props.className}>
        {elements}
    </tr>;
};

TableRow.defaultProps = {
    onDelete: () => { }
};

TableRow.propTypes = {
    className: PropTypes.string,
    model: PropTypes.object,
    row: PropTypes.object,
    options: PropTypes.object,

    context: PropTypes.object,
    //
    buttons: PropTypes.func,
    //
    onRenderRow: PropTypes.func,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    onChange: PropTypes.func
};

export default TableRow;
