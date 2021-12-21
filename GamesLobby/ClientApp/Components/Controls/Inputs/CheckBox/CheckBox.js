import './_checkBox.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../Icon/Icon';


export class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }

    toggle() {
        if (this.props.onClick) this.props.onClick(!this.state.checked);
        this.setState({ checked: !this.state.checked });
    }

    getValue() {
        return this.state.checked;
    }

    render() {
        return <React.Fragment>
            <div className={'input check' + (this.state.checked ? ' checked' : '')} onClick={() => this.toggle()}>
                <div className='--before' />
                {this.state.checked && <Icon icon={'check'} size='xs' />}
            </div>
        </React.Fragment>;
    }
}

CheckBox.defaultProps = {
    checked: false
};

CheckBox.propTypes = {
    onClick: PropTypes.func,
    checked: PropTypes.bool
};
