import React, { Component } from 'react'
import { createOllieEvent } from "../actions/socketActions"
import { connect } from 'react-redux'
import { Row, Col } from 'react-materialize'


const imgJson = {
    "name": "image_example",
    "event": "display",
    "payload": {
        "device": process.env.REACT_APP_MONITOR,
        "action": "show",
        "element": "image",
        "img_id": 0,
        "tag": "busmap",
        "top": 200,
        "left": 200,
        "width": 100
    }
}

const webJson = {
    "name": "best_mile",
    "event": "display",
    "payload": {
        "device": process.env.REACT_APP_MONITOR,
        "action": "show",
        "element": "web",
        "web_id": 0,
        "src": "https://localmotors.env.partners.bestmile.io",
        "fullscreen": true,
        "top": 200,
        "left": 100,
        "width": 600,
        "height": 400
    }
}

let videoJson = {
    "name": "rear_video",
    "event": "display",
    "payload": {
        "device": process.env.REACT_APP_MONITOR,
        "action": "show",
        "element": "video",
        "video_id": 0,
        "src": "Video-Rear-6.mov",
        "fullscreen": true,
        "playbackRate": 2,
        "top": 600,
        "left": 100,
        "width": 200,
        "height": 100
    }
}

let messageJson = {
    "name": "message",
    "event": "display",
    "payload": {
        "device": process.env.REACT_APP_MONITOR,
        "element": "message",
        "txt": "We have arrived at Discovery Square.",
        "m_id": 0
    }
}

class EventSender extends Component
{

    constructor( props )
    {
        super( props )

        this.handleChange = this.handleChange.bind( this )
        this.send = this.send.bind( this )

        this.state = {
            value: ""
        }
    }

    handleChange( event )
    {
        this.setState( { value: event.target.value } )
    }

    send()
    {
        this.props.dispatch( createOllieEvent( JSON.parse( this.state.value ) ) )
    }

    render()
    {
        let style = { 'font-size': 12, 'line-height': 12, width: 200 }


        //videoJson.payload.startTime = new Date().getTime() - 60000;

        return (
            <div>
                <form>
                    <label style={{ height: 300 }}>
                        Event json:
                        <textarea
                            value={this.state.value}
                            style={{ height: 200 }}
                            onChange={( e ) =>
                            {
                                this.handleChange( e )
                            }}/>
                    </label>
                    <div onClick={this.send}
                         style={{ backgroundColor: 'blue', width: 50, color: 'white', margin: 10 }}>Send
                    </div>
                </form>

                EXAMPLE:
                <Row>
                    <Col>Show a message popup
                        <pre style={style}>{JSON.stringify( messageJson, null, 2 )}</pre>
                    </Col>
                    <Col>Open a window for a url
                        <pre style={style}>{JSON.stringify( webJson, null, 2 )}</pre>
                    </Col>
                    <Col>Open a window for a video
                        <pre style={style}>{JSON.stringify( videoJson, null, 2 )}</pre>
                    </Col>
                    <Col>Show an image
                        <pre style={style}>{JSON.stringify( imgJson, null, 2 )}</pre>
                    </Col>
                </Row>

            </div>
        )
    }
}

EventSender = connect(
    // mapStateToProps,
    // mapDispatchToProps
)( EventSender )

export default EventSender