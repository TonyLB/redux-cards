import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from '../App';
import { createStore, applyMiddleware } from 'redux'
import testApp from '../../reducers/testApp'
import preloadState from '../../preload'

describe('app', () => {
  it('renders without crashing', () => {
    const store = createStore(
        testApp, 
        preloadState()
    )

    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
          <App />
      </Provider>,div);
  })
})