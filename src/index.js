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

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)