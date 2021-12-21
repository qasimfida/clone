import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon/Icon';


const renderSorting = (options, field) => {
    const sorting = options ?? options?.sorting.enabled;
    const isSortingField = sorting && options.sorting && options.sorting.field && options.sorting.field.column == field.name;
    const up = isSortingField && options.sorting.field.direction == 1;
    const down = isSortingField && options.sorting.field.direction == 0;
    return <div className='flex vertical auto-width margin-right toggle-sorting'>
        <Icon icon='sort-up' size='xs' className={up ? '' : 'passive'} onClick={() => { options.sorting.onSortingChange({ column: field.name, direction: 1 }); }} />
        <Icon icon='sort-down' size='xs' className={down ? '' : 'passive'} onClick={() => { options.sorting.onSortingChange({ column: field.name, direction: 0 }); }} />
    </div>;
};

const renderHeader = (field, props) => {
    if (props.options?.sorting?.enabled) {
        return <div className='flex auto-width'>{renderSorting(props.options, field)}{field.renderHead ? field.renderHead() : field.title}</div>;
    }

    return field.renderHead ? field.renderHead(props.context) : field.title;
};

export const TableHead = (props) => {
    const head = props.model.fields.map((field, index) => {
        return <th key={index} className={'column-' + field.name.toLowerCase()}>{renderHeader(field, props)}</th>;
    });

    const allSelected = props.data.filter(x => !x.__selected).length == 0 && props.data.length > 0;
    return <thead className={props.options?.sorting ? 'sorting' : null}>
        <tr>
            {props.options.draggable?.enabled && <th className='table-option-draggable-header'></th>}
            {props.options.selectable && <th className='table-option-selectable-header'><Icon icon={allSelected ? 'check-square' : 'square'} type='far' onClick={() => props.onSelectAll()} /></th>}
            {head}
            {props.options.data && props.options.data.delete.enabled && <th className='table-option-delete-header'>
                {props.options.data.delete.header && <Icon icon='trash' onClick={() => props.onDeleteAll()} />}
            </th>}
            {props.buttons && <th className='table-option-buttons-header'></th>}
        </tr>
    </thead>;
};

TableHead.propTypes = {
    model: PropTypes.object,
    data: PropTypes.array,
    options: PropTypes.object,
    // rendering
    buttons: PropTypes.func,
    //

    onSelectAll: PropTypes.func,
    onDeleteAll: PropTypes.func
};