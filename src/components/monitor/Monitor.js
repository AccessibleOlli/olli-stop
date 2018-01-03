import React, { Component } from 'react'
import { connect } from 'react-redux'

import WebElement from './elements/WebElement';
import ImageElement from './elements/ImageElement';
import VideoElement from './elements/VideoElement';
import MessageElement from './elements/MessageElement';


class Monitor extends Component
{

    constructor( props )
    {
        super( props )
        this.state = {
            elements: []
        }
    }

    componentWillReceiveProps(nextProps)
    {
    }

    render()
    {
        let { webElements, videoElements, imageElements, messages } = { ...this.props }

        return (
            <div>
                <VideoElement {...videoElements[0]}/>
                <VideoElement {...videoElements[1]}/>
                <VideoElement {...videoElements[2]}/>
                <VideoElement {...videoElements[3]}/>
                <VideoElement {...videoElements[4]}/>
                <VideoElement {...videoElements[5]}/>
                <VideoElement {...videoElements[6]}/>
                <VideoElement {...videoElements[7]}/>
                <VideoElement {...videoElements[8]}/>
                <VideoElement {...videoElements[9]}/>

                <WebElement {...webElements[0]}/>
                <WebElement {...webElements[1]}/>
                <WebElement {...webElements[2]}/>
                <WebElement {...webElements[3]}/>
                <WebElement {...webElements[4]}/>
                <WebElement {...webElements[5]}/>
                <WebElement {...webElements[6]}/>
                <WebElement {...webElements[7]}/>
                <WebElement {...webElements[8]}/>
                <WebElement {...webElements[9]}/>

                <ImageElement {...imageElements[0]}/>
                <ImageElement {...imageElements[1]}/>
                <ImageElement {...imageElements[2]}/>
                <ImageElement {...imageElements[3]}/>
                <ImageElement {...imageElements[4]}/>
                <ImageElement {...imageElements[5]}/>
                <ImageElement {...imageElements[6]}/>
                <ImageElement {...imageElements[7]}/>
                <ImageElement {...imageElements[8]}/>
                <ImageElement {...imageElements[9]}/>

                { messages.map(m => <MessageElement key={m.m_id} {...m}/>) }

            </div>
        )
    }
}


Monitor = connect( state =>
{
    return {
        webElements: state.display.webElements,  // object -> array
        videoElements: state.display.videoElements,
        imageElements: state.display.imageElements,
        messages: Object.values(state.display.messages),
        force: state.display.force
    }
} )( Monitor );

export default Monitor