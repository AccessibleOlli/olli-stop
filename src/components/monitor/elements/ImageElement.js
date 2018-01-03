import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardPanel } from 'react-materialize'

class ImageElement extends Component {

    constructor(props)
    {
        super(props)

    }

    render()
    {
        let {file, tag, width, action, top, left } = {...this.props}

        let display = 'none'
        if( action === "show")
        {
            display = "block"
        }

        let src = 'http://localhost:' + process.env.REACT_APP_PORT;

        if(file)
        {
            src += "/" + file
        }
        else if(tag)
        {
            src += "/images?tag=" + tag;
        }

        return (
                    <img style={{
                        position: 'absolute',
                        display: display,
                        width,
                        top,
                        left
                    }}
                         src={src}/>
        )
    }
}

ImageElement = connect( state =>
{
    return {
    }
} )( ImageElement );

export default ImageElement