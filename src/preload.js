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

const combineDenormalizedObjects = (
        object1 = { byId: {}, allIds: [] }, 
        object2 = { byId: {}, allIds: [] }
    ) => {
    let tempObject = { ...object1 }
    object2.allIds.forEach((tempId) => {
        tempObject.byId[tempId] = object2.byId[tempId]
    })
    tempObject.allIds = [ ...tempObject.allIds, ...object2.allIds ]
    return tempObject
}

const preloadDecks = (state) => {
    const deckId = generateKey('STACK')
    const discardId = generateKey('STACK')
    const cards = listToDenormalizedObject(
        ['X', 'Y', 'X', 'Y', 'X', 'X', 'X', 'Y', 'X', 'X'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue + 'Card'].id })),
        'CARD'
    )
    let decks = {
        byId: {
            [deckId]: {
                id: deckId,
                cards: cards.allIds,
            },
            [discardId]: {
                id: discardId,
                cards: []
            }
        },
        allIds: [deckId, discardId]
    } 
    return {
        ...state,
        cards: combineDenormalizedObjects(state.cards, cards),
        mainDeckId: deckId,
        discardDeckId: discardId,
        stacks: combineDenormalizedObjects(state.stacks, decks)
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
    let stacks = listToDenormalizedObject(
        [1, 2, 3, 4, 5].map((stack) => ({ cards: [] })),
        'STACK'
    )
    return {
        ...state,
        hand: {
            id: generateKey('HAND'),
            stacks: stacks.allIds,
            timerId: timerId
        },
        stacks: combineDenormalizedObjects(state.stacks, stacks),
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
        preloadRandoms,
        preloadDecks,
        preloadHand
    ]
    loadFuncs.forEach((loadFunc) => { state = loadFunc(state) })
    return state
}

export default preloadState