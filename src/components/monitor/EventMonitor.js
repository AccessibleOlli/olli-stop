import React, { Component } from 'react'
import { connect } from 'react-redux'

import Monitor from './Monitor'
import EventSender from './EventSender'

class EventMonitor extends Component
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
        return (
            <div>
                <Monitor/>

                <div style={{backgroundColor:'AliceBlue'}}>
                    <EventSender/>
                </div>
            </div>
        )
    }
}


EventMonitor = connect( state =>
{
    return {
    }
} )( EventMonitor );

export default EventMonitor