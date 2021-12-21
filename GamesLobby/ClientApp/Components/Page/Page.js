import './_page.scss';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


export const Page = (props) => {
    useEffect(() => {
        if (props.compact) document.getElementsByTagName('html')[0].classList.add('compact');
        if (!props.compact) document.getElementsByTagName('html')[0].classList.remove('compact');
    }, []);


    return <div className={'page' + (props.className ? ` ${props.className}` : '')}>
        {props.children}
    </div >;
};

Page.propTypes = {
    className: PropTypes.string,
    compact: PropTypes.bool,
    children: PropTypes.node
};