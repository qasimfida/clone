import './_table.scss';
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from './arrayMove';
import { TableHead } from './TableHead';
import { TableFooter } from './TableFooter';



const SortableCont = SortableContainer(({ children }) => {
    return <tbody>{children}</tbody>;
});

const SortableItem = SortableElement(props => <TableRow {...props} />);


const createModel = (model) => {
    if (typeof (model) === 'object') {
        return model;
    }
    return null;
};


const createOptions = (options) => {
    if (!options) {
        options = {
            data: {
                delete: {
                    enabled: false,
                    header: false
                }
            },
            header: {
                show: true,
            },
            draggable: {
                enabled: false
            },
            selectable: false
        };
    }


    if (!options.header) {
        options.header = {
            show: true
        };
    }
    return options;
};




export const Table = (props) => {
    const [model, setModel] = useState(null);
    const [data, setData] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const options = createOptions(props.options);

    const tableContext = {
        expandRow: (index, data) => {
            var copy = Object.assign({}, expandedRows);
            copy[index] = data;
            setExpandedRows(copy);
        }
    };

    var highlightedRow = null;
    var table = null;


    const onSortStart = useCallback(({ node, index, collection, isKeySorting }) => {
        if (props.onSortStart) {
            props.onSortStart(node, index, collection, isKeySorting);
        }
        highlightedRow.row.__highlighted = false;
        node.classList.remove('row-highlighted');
    });

    const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
        var items = oldItems => {
            var res = arrayMove(oldItems, oldIndex, newIndex);
            props.onDataChange(null, null, res);
            return res;
        };

        if (props.onSortEnd) {
            props.onSortEnd(oldIndex, newIndex);
        }

        if (highlightedRow.index == oldIndex) {
            data[oldIndex].__highlighted = false;
            data[newIndex].__highlighted = true;
            highlightedRow.row = data[newIndex];
            highlightedRow.element = table.getElementsByTagName('tbody')[0].children[newIndex];
            highlightedRow.element.classList.add('row-highlighted');
        }
        setData(items);
    });

    const onSelect = (row) => {
        var foundRow = data.find(x => x == row);
        if (foundRow) {
            foundRow.__selected = !foundRow.__selected;
            var result = Object.assign([], data);
            props.onDataChange(null, null, result);
        }
    };

    const onSelectAll = () => {
        const allSelected = data.filter(x => !x.__selected).length == 0;
        data.map(x => {
            x.__selected = allSelected ? false : true;
        });
        props.onDataChange(null, null, data);
    };

    const onDelete = (row) => {
        data.splice(data.findIndex(x => x == row), 1);
        var result = Object.assign([], data);
        props.onDataChange(null, null, result);
    };

    const onDeleteAll = () => {
        props.onDataChange(null, null, []);
    };

    const findParentElementNode = (element, type) => {
        if (element.nodeName == type) return element;
        if (!element.parentElement) return null;
        if (element.parentElement.nodeName == type) return element.parentElement;
        return findParentElementNode(element.parentElement, type);
    };

    const handleTableClick = (e) => {
        const element = e.target;
        const isThead = findParentElementNode(element, 'THEAD');
        if (isThead) return;
        const tbody = findParentElementNode(element, 'TBODY');
        const parentTable = findParentElementNode(element, 'TABLE');
        if (parentTable.className.indexOf('expanded-table') >= 0) return;
        var tr = element;
        if (tr.nodeName !== 'TR') {
            tr = findParentElementNode(element, 'TR');
        }

        // remove expanded rows;
        const tbodyChildren = Object.assign([], tbody.children).filter(x => {
            if (x.className.indexOf('row-expanded-item') >= 0) return false;
            return true;
        });

        const index = Array.prototype.indexOf.call(tbodyChildren, tr);
        if (!tr) return;
        if (tr.classList.contains('row-expanded-item')) return;

        if (props.onRowClick) {
            props.onRowClick(tr, data[index], index, tableContext);
        }
        if (highlightedRow) {
            highlightedRow.row.__highlighted = false;
        }
        var elements = table.getElementsByTagName('tbody')[0].getElementsByClassName('row-highlighted');
        if (elements.length > 0) {
            elements[0].classList.remove('row-highlighted');
        }

        highlightedRow = {
            element: tr,
            index: index,
            row: data[index]
        };

        highlightedRow.row.__highlighted = true;
        tr.classList.add('row-highlighted');
    };

    useEffect(() => {
        if (!model) {
            setModel(createModel(props.model));
            if (options.selectable) {
                props.data.map(x => {
                    if (!x.hasOwnProperty('__selected')) {
                        x.__selected = true;
                    }
                });
            }
            setData(props.data);
            return;
        }
    });

    if (!model) return <div>loading</div>;


    return (
        <table onClick={(e) => handleTableClick(e)} ref={(r) => table = r} className={props.className}>
            {options.header.show &&
                <TableHead
                    model={model} data={props.data}
                    context={props.context}
                    options={options}
                    buttons={props.buttons}
                    onSelectAll={onSelectAll.bind(this)}
                    onDeleteAll={onDeleteAll.bind(this)} />
            }
            <SortableCont
                onSortStart={onSortStart}
                onSortEnd={onSortEnd}
                axis='y'
                lockAxis='y'
                lockToContainerEdges={true}
                lockOffset={['30%', '50%']}
                helperClass='draggable-row'
                useDragHandle={true}
            >
                {
                    data.map((row, index) => {
                        return <React.Fragment key={`item-${index}`}>
                            <SortableItem
                                className={expandedRows && expandedRows.hasOwnProperty(index) && 'row-expanded'}
                                index={index}
                                model={model}
                                options={options}
                                row={row}
                                context={props.context}
                                buttons={props.buttons}
                                onChange={props.onRowChange.bind(this)}
                                onSelect={(row) => onSelect(row)}
                                onDelete={(row) => onDelete(row)}
                                onRenderRow={props.onRenderRow ? props.onRenderRow.bind(this) : null}
                            />
                            {(expandedRows && expandedRows.hasOwnProperty(index)) && <tr className='row-expanded-item'>{expandedRows[index]}</tr>}
                        </React.Fragment>;
                    })
                }
            </SortableCont>
            {props.children}
            {props.footer && <TableFooter model={model} data={props.footer}
                options={options}
                buttons={props.buttons} />}
        </table>
    );
};

Table.defaultProps = {
    className: '',
    model: '',
    data: [],
    options: null,
    buttons: null,
    onDataChange: () => { },
    onRowChange: () => { }
};

Table.propTypes = {
    className: PropTypes.string,
    model: PropTypes.any,
    data: PropTypes.array,
    footer: PropTypes.object,
    options: PropTypes.object,

    buttons: PropTypes.func,

    context: PropTypes.object,

    children: PropTypes.node,

    onSortStart: PropTypes.func,
    onSortEnd: PropTypes.func,

    onRenderRow: PropTypes.func,
    onDataChange: PropTypes.func,
    onRowChange: PropTypes.func,

    onRowClick: PropTypes.func
};



