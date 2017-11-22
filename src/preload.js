import { generateKey } from './reducers/keys'
import CardTemplate from './state/CardTemplates'

const listToDenormalizedObject = (list, prefix) => {
    const values = list.map(value => ({
            ...value,
            id: generateKey(prefix)
        }))
    return {
        byId: values.reduce((obj, value) => ({
                ...obj,
                [value.id]: value
            }), {}),
        allIds: values.map(value => (value.id))
    }
}

const preloadCards = (state) => ({
    ...state,
    cards: listToDenormalizedObject(
        ['X', 'Y', 'X', 'Y', 'X', 'X', 'X', 'Y', 'X', 'X'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue + 'Card'].id })),
        'CARD'
    )
})

const preloadStacks = (state) => ({
    ...state,
    stacks: listToDenormalizedObject(
        [1, 2, 3, 4, 5].map((stack) => ({ cards: [] })),
        'STACK'
    )
})

const preloadDecks = (state) => {
    const deckId = generateKey('DECK')
    const discardId = generateKey('DECK')
    return {
        ...state,
        mainDeckId: deckId,
        discardDeckId: discardId,
        decks: {
            byId: {
                [deckId]: {
                    id: deckId,
                    cards: state.cards.allIds,
                },
                [discardId]: {
                    id: discardId,
                    cards: []
                }
            },
            allIds: [deckId, discardId]
        }
    }    
}

const preloadRandoms = (state) => {
    let randomVals = []
    for (let x = 0; x < 2000; x++) {
        randomVals.push(Math.random())
    }

    return {
        ...state,
        random: {
            values: randomVals,
            index: 0
        }
    }
}

const preloadHand = (state) => {
    let timerId = generateKey('TIMER')
    return {
        ...state,
        hand: {
            id: generateKey('HAND'),
            stacks: state.stacks.allIds,
            timerId: timerId
        },
        timers: {
            byId: {
                [timerId]: {
                    id: timerId,
                    duration: 5000,
                    startTime: new Date()
                }
            },
            allIds: [timerId]
        }
    }
}

const preloadState = () => { 
    let state = {}
    let loadFuncs = [
        preloadCards,
        preloadStacks,
        preloadRandoms,
        preloadDecks,
        preloadHand
    ]
    loadFuncs.forEach((loadFunc) => { state = loadFunc(state) })
    return state
}

export default preloadState