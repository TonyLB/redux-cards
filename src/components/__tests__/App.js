import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from '../App';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import testApp from '../../reducers/testApp'
import preloadState from '../../preload'
import { startTimer } from '../../actions/timers'

describe('app', () => {
  it('renders without crashing', () => {
    const store = createStore(
        testApp, 
        preloadState(),
        applyMiddleware(thunk)
    )

    store.dispatch(startTimer({ 
        id: 'HARVEST-TIMER', 
        duration: 2500, 
        execute: (dispatch, getState) => {
            if (getState().settings['AUTO-DRAW']) {
                dispatch(drawCard())                            
            }
        }
    }))
    
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
          <App />
      </Provider>,div);
  })
})