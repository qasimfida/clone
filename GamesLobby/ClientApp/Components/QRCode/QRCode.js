import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';

export const QRCode = (props) => {
    const [qr, setQR] = useState(null);
    const qrCanvas = useRef();
    useEffect(() => {
        setTimeout(() => setQR(props.text), 1000);
    }, []);

    useEffect(() => {
        if (!qr) return;
        console.log(props.text);
        QRCodeGenerator.toCanvas(qrCanvas.current, props.text, function (error) {
            if (error) console.error(error);
        });
    }, [qr]);

    return <div className="qr-area"><canvas ref={qrCanvas} className="qrcode-canvas"></canvas></div>;
};


QRCode.propTypes = {
    text: PropTypes.string
};
