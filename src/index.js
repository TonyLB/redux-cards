import "babel-polyfill";
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import testApp from './reducers/testApp'
import App from './components/App'
import './index.css';
import preloadState from './preload'
import { startTimer } from './actions/timers'
import { drawCard } from './actions/hand'
import { advanceTrack } from './actions/track'

let store = createStore(
    testApp, 
    preloadState(),
    applyMiddleware(thunk)
);

store.dispatch(startTimer({ 
    id: 'HARVEST-TIMER', 
    duration: 2500, 
    execute: (dispatch, getState) => {
        if (getState().settings['AUTO-DRAW']) {
            dispatch(drawCard())                            
        }
    }
}))
store.dispatch(startTimer({
    id: 'EQUIPMENT-TIMER',
    duration: 4000,
    execute: (dispatch, getState) => { 
        dispatch(advanceTrack(getState().hand.equipmentTrack))
    },
    repeating: true
}))

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)