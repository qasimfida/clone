import './_switch.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }


    toggle() {
        if (!this.props.enabled) return;
        this.setState({ checked: !this.state.checked }, () => {
            this.props.onChange(this.state.checked);
        });
    }

    setValue(value) {
        this.setState({ checked: value });
    }

    getValue() {
        return this.state.checked;
    }

    render() {
        var classes = ['input','switch',this.props.className];
        var classNames = classes.join(' ');
        return <React.Fragment>
            {this.props.title && <label>{this.props.title}</label>}
            <div className={classNames + (this.state.checked ? ' checked' : '')} onClick={() => this.toggle()}>
                <div className='track' />
                <div className='thumb' />
            </div>
        </React.Fragment>;
    }
}

Switch.defaultProps = {
    className:'',
    title: null,
    checked: false,
    onChange: () => { },
    enabled: true
};

Switch.propTypes = {
    className: PropTypes.string,
    title: PropTypes.any,
    enabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};
