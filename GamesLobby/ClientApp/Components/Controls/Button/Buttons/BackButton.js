
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { withRouter } from 'react-router-dom';

const BackButton = (props) => {
    var propsCopy = Object.assign({}, props);
    propsCopy.className += ' flat';
    propsCopy.title = 'Back';
    propsCopy.onClick = () => {
        props.history.goBack();
        props.onClick();
    };

    propsCopy.icon = 'arrow-left';

    return <Button {...propsCopy} />;
};

BackButton.defaultProps = {
    onClick: () => { },
    className: ''
};

BackButton.propTypes = {
    history: PropTypes.object,
    className: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func
};
const hoc = withRouter(BackButton);
export { hoc as BackButton };