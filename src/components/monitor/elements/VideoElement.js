import React, { Component } from 'react'
import ReactPlayer from 'react-player'

let _ = require( 'lodash' );

class VideoWindow extends Component
{
    constructor( props, context )
    {
        super( props, context );

        this.onPause = this.onPause.bind( this )
        this.onPlay = this.onPlay.bind( this )

        this.state = { playing: false }
    }

    componentDidMount()
    {
        this.initialize( this.props )
    }

    componentWillReceiveProps( nextProps )
    {
        if ( nextProps.action !== this.props.action )//  || nextProps.startTime !== this.props.startTime )
        {
            if(nextProps.action === 'show' && (this.props.action === 'play' || this.props.action === 'pause'))
            {
                // do nothing.  we are already showing the video
                return;
            }

            if(nextProps.action === 'pause')
            {
                this.setState( { playing: false } )
            }
            if(nextProps.action === 'play')
            {
                this.setState( { playing: true } )
            }
            else {
                this.initialize( nextProps )
            }
        }
    }

    initialize( props )
    {
        let show = false


        if( typeof props.action !== 'undefined' && props.action === 'show')
        {
            //show = true;

            this.setState( {playing: false}, () => {
                this.seekTo( 0 )
                this.play()
            })

        }
        //
        // if ( show )
        // {
        //     this.playAtTime( props.startTime )
        // }
        // else
        // {
        //     // once hidden a new startTime will be needed when shown again
        //     this.seekTo( 0 )
        // }
    }

    seekTo( amountInSeconds )
    {
        this.player.seekTo( amountInSeconds )
    }

    getCurrentTime()
    {
        this.player.getCurrentTime()
    }

    getDuration()
    {
        this.player.getDuration()
    }

    getInternalPlayer()
    {
        this.player.getInternalPlayer()
    }


    playAtTime( timeTarget ) // UTC
    {
        // We have to stop playing in order to do a seek, and then start playing again
        this.setState( {playing: false}, () => {
            let now = new Date().getTime()
            let offsetMilliseconds = timeTarget - now

            if ( offsetMilliseconds >= 0 )
            {
                this.seekTo( 0 )
                setTimeout( () => this.play(), offsetMilliseconds )
            }
            else
            {
                this.seekTo( -offsetMilliseconds / 1000 )
                this.play()
            }
        })
    }

    play()
    {
        this.setState( { playing: true } )
    }

    onPause()
    {
        console.log( 'paused' )
    }

    onPlay()
    {
        console.log( 'play' )
    }

    render()
    {
        let { top, left, height, width, src, fullscreen, playbackrate, action } = { ...this.props }

        let display = "none"
        let hidden = true

        if( action === "show" || action === "pause" || action === "play")
        {
            display = "block"
            hidden = false
        }

        if ( fullscreen )
        {
            width = "100%" //window.innerWidth
            height = "100%" //window.innerHeight
            top = 0
            left = 0
        }

        //let url = 'http://localhost:' + process.env.REACT_APP_PORT + "/" + src
        let url = src;

        //console.log('VIDEO URL: ' + url)

        return (
            <div style={{ top, left, position: 'absolute', display }}>
                <ReactPlayer
                    ref={(player => this.player = player)}
                    url={url}
                    preload="true"
                    playing={!hidden && this.state.playing}
                    height={height}
                    width={width}
                    onPause={this.onPause}
                    onPlay={this.onPlay}
                    playbackRate={playbackrate || 1}
                />
            </div>
        )
    }
}

export default VideoWindow