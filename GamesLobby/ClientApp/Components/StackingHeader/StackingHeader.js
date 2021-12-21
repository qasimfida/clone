import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export const StackingHeader = (props) => {
    var timeout = null;
    var prevScroll = 0;
    var hiding = false;
    const content = React.createRef();

    useEffect(() => {
        addEventListeners();
        const ref = content.current;
        return () => {
            removeEventListeners(ref);
        };
    }, []);


    const delayed = (f, t) => {
        clearTimeout(timeout);
        timeout = null;
        timeout = setTimeout(() => f(), t);
    };

    const scroll = (e) => {
        const currentScroll = e.target.scrollTop;
        const body = document.getElementsByTagName('html')[0];
        const isHiding = currentScroll > prevScroll;
        if (currentScroll <= 0) return;
        if (e.target.offsetHeight + e.target.scrollTop >= body.scrollHeight) {
            return;
        } 
        if (isHiding != hiding) {
            if (isHiding) {
                delayed(() => {
                    // down
                    body.classList.add('scroll-down');
                }, 10);
            } else {
                delayed(() => {
                    // down
                    body.classList.remove('scroll-down');
                }, 10);
            }
        }

        hiding = currentScroll > prevScroll;
        prevScroll = currentScroll;
    };

    const addEventListeners = () => {
        const body = document.getElementsByTagName('html')[0];
        body.classList.remove('scroll-down');
        content.current.addEventListener('scroll', scroll);
    };

    const removeEventListeners = (ref) => {
        ref.removeEventListener('scroll', scroll);
    };


    return <div className='scrollable' ref={content}>
        {props.children}
    </div>;
};

StackingHeader.propTypes = {
    children: PropTypes.node
};