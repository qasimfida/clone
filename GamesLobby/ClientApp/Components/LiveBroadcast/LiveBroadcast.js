import './_live-broadcast.scss';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const LiveBroadcast = (props) => {
    const reducer = useSelector((state) => state[props.reducer]);
    const stream = reducer.stream;

    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const options = { // lookup the options in the docs for more options
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: stream?.source,
            type: 'application/x-mpegURL'
        }]
    };


    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            playerRef.current = videojs(videoElement, options, () => {
                //
            });

            playerRef.current.ready(function () {
                setTimeout(function () {
                    playerRef.current.autoplay('muted');
                    playerRef.current.fluid('true');
                }, 1000);
            });
        } else {
            // you can update player here [update player through props]
            // const player = playerRef.current;
            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);


    return <div className='card live-broadcast'>
        <div className='body'>
            <div data-vjs-player>
                <video ref={videoRef} className='video-js vjs-big-play-centered' />
            </div>
        </div>
    </div>;
};


LiveBroadcast.propTypes = {
    reducer: 'string'
};