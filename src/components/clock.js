import React, { Component } from 'react';

export default class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval( () => 
            this.tick(), 1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div className="stop-panel">
                <h2>Time</h2>
                <div className="clock">{this.state.date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
        );
    }
}
