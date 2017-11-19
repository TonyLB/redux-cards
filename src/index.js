import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import testApp from './reducers/testApp'
import App from './components/App'
import './index.css';
import { generateKey } from './reducers/keys'

let allIds = []
const defaultCards = ['X', 'Y', 'X', 'Y', 'X', 'X', 'X', 'Y', 'X', 'X'].map(cardValue => { 
    const tempId = generateKey('CARD')
    allIds.push(tempId)
    return { id: tempId, value: cardValue } 
});
let cardsObject = {}
defaultCards.forEach(card => { cardsObject[card.id] = card })

const deckId = generateKey('DECK')
const discardId = generateKey('DECK')
let decksObject = { }
decksObject.byId = { 
    [deckId]: {
        id: deckId,
        cards: allIds
    },
    [discardId]: {
        id: discardId,
        cards: []
    }
}
decksObject.allIds = [deckId, discardId]

let randomVals = []
for (let x = 0; x < 2000; x++) {
    randomVals.push(Math.random())
}
let timerId = generateKey('TIMER')
let timerObject = {}
timerObject[timerId] = {
    id: timerId,
    duration: 5000,
    startTime: new Date()
}

const preloadState = { 
    cards: { 
        byId: cardsObject, 
        allIds: allIds
    },
    decks: decksObject,
    hand: {
        id: generateKey('HAND'),
        cards: [],
        maxStacks: 7,
        timerId: timerId,
        timerStarted: new Date()
    },
    random: {
        values: randomVals,
        index: 1995
    },
    timers: {
        byId: timerObject,
        allIds: [ timerId ]
    },
    mainDeckId: deckId,
    discardDeckId: discardId
}

let store = createStore(testApp, preloadState);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)