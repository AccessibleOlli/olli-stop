import React, { Component } from 'react'
import IframeComm from "react-iframe-comm";


const WebWindow = ( { src, top, left, width, height, action } ) =>
{
    // the html attributes to create the iframe with
    // make sure you use camelCase attribute names
    const attributes = {
        src,
        width,
        height,
        frameBorder: 1, // show frame border just for fun...
    };

    let display = 'none'
    if( action === "show")
    {
        display = "block"
    }

    return (
        <div style={{ top, left, position: 'absolute', display }}>
            <IframeComm

                attributes={attributes}
            />
        </div>
    );
};

export default WebWindow