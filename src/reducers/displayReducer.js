import { handleActions } from 'redux-actions';

import {
    ollieEvent,
    deleteMessage
} from '../actions/index';

let initialState = {
    webElements: {},
    videoElements: {},
    imageElements: {},
    messages: {},
    welcome: { hidden: true },
    force: 0    // this is just here to force an update.
};

export default handleActions( {

    [ ollieEvent ]: ( state, action ) =>
    {
        let display = { ...state };

        let event = action.payload;

        switch ( event.payload.element )
        {
            case "welcome":
                display.welcome = event.payload;
                break
            case "web":
                display.webElements[ event.payload.web_id ] = event.payload
                break
            case "video":
                display.videoElements[ event.payload.video_id ] = event.payload
                break

            case "image":
                display.imageElements[ event.payload.img_id ] = event.payload
                break
            case "message":
                display.messages[ event.payload.m_id ] = event.payload
                break
            case "restart":
                display = { ...initialState }
                break
        }

        display.force++

        return ({
            ...display
        })
    },
    [ deleteMessage ]: ( state, action ) =>
    {
        let display = { ...state };

        delete display.messages[ action.payload.m_id ]

        display.force++

        return ({
            ...display
        })
    }

}, initialState )