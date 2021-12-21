import React from 'react';
import PropTypes from 'prop-types';

import { TableColumn } from './TableRow';

export const TableFooter = (props) => {

    const footer = props.model.fields.map((field, index) => {
        if (!props.data[field.name]) return <td />;
        return <TableColumn key={index} field={field} row={props.data} footer={true} />;
    });

    return <tfoot>
        <tr>
            {props.options?.draggable?.enabled && <th className='table-option-draggable-header'></th>}
            {props.options?.selectable && <th className='table-option-selectable-header'></th>}
            {footer}
            {props.options?.data && props.options.data.delete.enabled && <th className='table-option-delete-header'></th>}
            {props.buttons && <th className='table-option-buttons-header'></th>}
        </tr>
    </tfoot>;
};

TableFooter.propTypes = {
    model: PropTypes.object,
    data: PropTypes.object,
    options: PropTypes.object,

    // rendering
    buttons: PropTypes.func
};