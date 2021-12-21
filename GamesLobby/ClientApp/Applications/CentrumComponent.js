import React from 'react';
import PropTypes from 'prop-types';
import { CentrumContext } from './Centrum';

export const CentrumComponent = (props) => {
    return <CentrumContext.Consumer>
        {
            (context) => {
                console.log(context);
                return <React.Fragment>
                    {props.children}
                </React.Fragment>;
            }
        }
    </CentrumContext.Consumer>;
};

CentrumComponent.propTypes = {
    children: PropTypes.node
};
