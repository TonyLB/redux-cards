import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import testApp from './reducers/testApp'
import App from './components/App'
import './index.css';
import preloadState from './preload'

let store = createStore(
    testApp, 
    preloadState(),
    applyMiddleware(thunk)
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)