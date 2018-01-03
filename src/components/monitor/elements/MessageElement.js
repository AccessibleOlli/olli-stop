import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardPanel } from 'react-materialize'
import {deleteMessage} from '../../../actions/index'

class MessageElement extends Component {

    constructor(props)
    {
        super(props)

        this.state = {hidden: false}
    }

    componentDidMount()
    {
        setTimeout(() => {
            this.setState( {hidden: true } )

            this.props.dispatch( deleteMessage({m_id: this.props.m_id}))
        }
            , 5000)
    }

    render()
    {
        let display = "none"
        if( !this.state.hidden )
        {
            display = "block"
        }

        return (
            <div style={{
                top: window.innerHeight * 0.5 - 100,
                left: window.innerWidth * 0.5 - 75,
                position: 'absolute',
                display,
            }}>
                <CardPanel className="teal lighten-4 black-text">
                    <span>{this.props.txt}</span>
                </CardPanel>
            </div>
        )
    }
}

MessageElement = connect( state =>
{
    return {
    }
} )( MessageElement );

export default MessageElement