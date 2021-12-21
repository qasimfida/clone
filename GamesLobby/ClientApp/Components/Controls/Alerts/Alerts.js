import './_alerts.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatDistance } from 'date-fns';
import { Icon } from '../../Icon/Icon';




const alerts = (props) => {
    const [open, setOpen] = useState(false);
    const classList = ['alerts', props.className, 'margin-right'];
    var ref = null;
    var list = null;
    var timeout = null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!open) return;
            if (ref && !ref.contains(event.target)) {
                toggleOpen();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });


    const toggleOpen = () => {
        clearTimeout(timeout);
        if (open) {
            list.classList.remove('in');
            list.classList.add('out');
            timeout = setTimeout(() => {
                setOpen(!open);
            }, 200);
        } else {
            setOpen(!open);
        }
    };

    const renderNotifications = () => {
        if (!open) return;
        const render = false;
        if (!render) return;

        const now = new Date();
        var elements = props.notifications.map(notification => {
            var icon = 'exclamation-circle';
            var classList = ['flex', 'wrap'];
            switch (notification.type) {
                case 1:
                    classList.push('information');
                    break;
                case 2:
                    classList.push('warning');
                    break;
                case 3:
                    classList.push('critical');
                    break;
            }

            return <li key={notification.id} className={classList.join(' ')}>
                <div className='flex vertical'>
                    <span className='date medium'>{formatDistance(new Date(notification.date), now, {
                        addSuffix: true
                    })}</span>
                    <span className='title'>{notification.title}</span>
                </div>
                <Icon icon={icon} className='align-right' />
            </li>;
        });

        return <ul className='surface border radius shadow fade in' ref={(r) => list = r}>{elements}</ul>;
    };


    return <div className={classList.join(' ')} ref={(r) => ref = r}>
        <a className='circular' onClick={() => toggleOpen()}><Icon icon='bell' /></a><span className='badge'>{props.notifications.length}</span>
        {renderNotifications()}
    </div>;
};



alerts.defaultProps = {
    className: '',

    notifications: [
        {
            id: 1,
            date: '2021-01-01',
            type: 1,
            title: 'Alert 1',
            data: null
        },
        {
            id: 2,
            date: '2021-04-01',
            type: 2,
            title: 'Alert 2',
            data: null
        },
        {
            id: 2,
            date: '2021-05-01',
            type: 3,
            title: 'Alert 3',
            data: null
        },
        {
            id: 2,
            date: '2021-01-01',
            type: 1,
            title: 'Alert 4',
            data: null
        }
    ]
};

alerts.propTypes = {
    className: PropTypes.string,
    user: PropTypes.object,

    notifications: PropTypes.array
};

// CONFIGURE REACT REDUX

const mapStateToProps = state => {
    return {
        user: state.user.profile
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(alerts);


// EXPORT COMPONENT

export default hoc;
