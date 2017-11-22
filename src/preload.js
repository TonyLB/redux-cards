import { generateKey } from './reducers/keys'
import { StateTypes } from './state/index'
import CardTemplate from './state/CardTemplates'

const emptyDenormalizedObject = { byId: {}, allIds: [] }

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
        object1 = emptyDenormalizedObject, 
        object2 = emptyDenormalizedObject
    ) => {
    let tempObject = { ...object1 }
    object2.allIds.forEach((tempId) => {
        tempObject.byId[tempId] = object2.byId[tempId]
    })
    tempObject.allIds = [ ...tempObject.allIds, ...object2.allIds ]
    return tempObject
}

const preloadNulls = (state) => {
    let nullProp = 'NULL-STACK'
    return {
        ...state,
        stacks: combineDenormalizedObjects(state.stacks, {
            byId: {
                [nullProp]: {
                    id: nullProp,
                    cards: []
                }
            },
            allIds: [nullProp]
        })
    }
}

const preloadDecks = (state) => {
    const deckId = generateKey(StateTypes.Stack)
    const discardId = generateKey(StateTypes.Stack)
    const cards = listToDenormalizedObject(
        ['X', 'Y', 'X', 'Y', 'X', 'X', 'X', 'Y', 'X', 'X'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue + 'Card'].id })),
        StateTypes.Card
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
        hand: { 
            ...state.hand,
            drawId: deckId,
            discardId: discardId,    
        },
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
    let timerId = generateKey(StateTypes.Timer)
    let stacks = listToDenormalizedObject(
        [1, 2, 3, 4, 5].map((stack) => ({ cards: [] })),
        StateTypes.Stack
    )
    return {
        ...state,
        hand: {
            id: generateKey(StateTypes.Hand),
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

const preloadTracks = (state) => {
    const deckId = generateKey(StateTypes.Stack)
    const cards = listToDenormalizedObject(
        ['A', 'B', 'C', 'C', 'B', 'A'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue + 'Card'].id })),
        StateTypes.Card
    )
    let decks = {
        byId: {
            [deckId]: {
                id: deckId,
                cards: cards.allIds,
            },
        },
        allIds: [deckId]
    }
    const trackId = generateKey(StateTypes.Track)
    let tracks = {
        byId: {
            [trackId]: {
                id: trackId,
                cards: [],
                trackSize: 5,
                deck: deckId,
            },
        },
        allIds: [trackId]
    } 
    return {
        ...state,
        trackId: trackId,
        cards: combineDenormalizedObjects(state.cards, cards),
        tracks: combineDenormalizedObjects(state.tracks, tracks),
        stacks: combineDenormalizedObjects(state.stacks, decks)
    }        
}

const preloadState = () => { 
    let loadFuncs = [
        preloadNulls,
        preloadRandoms,
        preloadHand,
        preloadDecks,
        preloadTracks
    ]
    return loadFuncs.reduce((state, loadFunc) => ( loadFunc(state) ), {})
}

export default preloadState