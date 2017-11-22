import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import testApp from './reducers/testApp'
import App from './components/App'
import './index.css';
import preloadState from './preload'

let store = createStore(testApp, preloadState());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)