import React from 'react';
import { Modal, Overlay } from '../../Applications/Centrum';
import { BusyModal } from '../../Components/Modals/BusyModal/BusyModal';
import { ErrorModal } from '../../Components/Modals/ErrorModal/ErrorModal';
import { getStore } from '../../State/Stores/AppStore';

export const Endpoints = {
    Session: '/api/session'
};


const prepareRequestParameters = (...props) => {
    const url = props[0];
    const data = props[1];
    const title = props[2];
    const error = props[3];
    const type = props[4];

    return {
        url: url,
        data: data,
        title: title,
        error: error,
        type: type
    };
};


export const API = {
    get: (...props) => {
        var p = prepareRequestParameters(...props);
        return API.request(p.url, p.data, p.title, p.error, 'GET');
    },
    post: (...props) => {
        var p = prepareRequestParameters(...props);
        return API.request(p.url, p.data, p.title, p.error, 'POST');
    },
    raw: (...props) => {
        var p = prepareRequestParameters(...props);
        return API.request(p.url, p.data, p.title, p.error, 'GET', true);
    },
    request: (url, data, title, error, type, raw) => {
        Overlay.open(<BusyModal title={title} />);
        getStore().dispatch({
            type: 'REQUEST',
            payload: url
        });
        return new Promise((resolve, reject) => {
            try {
                var options = {
                    method: type,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Timezone-Offset': new Date().getTimezoneOffset()
                    },
                    credentials: 'same-origin'
                };

                if (!raw) options.headers['Accept'] = 'application/json';
                if (data) options.body = JSON.stringify(data);

                fetch(url, options)
                    .then((res) => {
                        if (res.status == 204) {
                            return {
                                status: 0,
                                error: {
                                    message: 'Service is not responding / timeout.'
                                }
                            };
                        }
                        if (res.status == 400) {
                            return {
                                status: 0,
                                error: {
                                    message: 'Bad request.'
                                }
                            };
                        }
                        if (res.status == 415) {
                            return {
                                status: 0,
                                error: {
                                    message: 'Unsupported request.'
                                }
                            };
                        }
                        if (res.status == 500) {
                            return {
                                status: 0,
                                error: {
                                    message: 'API Error.'
                                }
                            };
                        }

                        if (res.status == 404) {
                            return {
                                status: 0,
                                error: {
                                    message: 'Service not found.'
                                }
                            };
                        }
                        try {
                            return res.json();
                        } catch (err) {
                            return {
                                status: 0,
                                error: {
                                    message: 'Corrupted data.'
                                }
                            };
                        }
                    })
                    .then(
                        (result) => {
                            Overlay.close();
                            if (result && !result.status) {
                                throw result;
                            }
                            if (!result || !result.status) {
                                throw result;
                            }
                            if (result.status != 0 && result.staus != 1) {
                                if (result.status == 204) {
                                    throw 'Service is not responding / timeout.';
                                }
                                if (result.status == 400) {
                                    throw 'Bad request.';
                                }
                                if (result.status == 415) {
                                    throw 'Unsupported request.';
                                }
                                if (result.status == 500) {
                                    throw 'API Error.';
                                }
                                if (result.status == 404) {
                                    throw 'Service not found.';
                                }
                            }
                            resolve(result);
                        }
                    ).catch(e => {
                        if (e.toString().indexOf('Unauthorized Player Access') >= 0) {
                            window.location.href = '/';
                            return;
                        }
                        var errorMessage = null;
                        if (e.error) {
                            //
                            if (e.error.message) {
                                errorMessage = e.error.message;
                            }
                        } else if (typeof e === 'object' && e !== null) {
                            errorMessage = e.toString();
                        }

                        if (error) {
                            Overlay.close();
                            Modal.open(<ErrorModal title={error} description={errorMessage ?? 'Service error please try later'} />);
                            return;
                        }
                        reject(e);
                    });
            } catch (err) {
                reject('error');
            }
        });
    }
};

