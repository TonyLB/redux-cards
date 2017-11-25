import { generateKey } from './reducers/keys'
import { StateTypes, listToDenormalized, combineDenormalizedObjects } from './state'
import CardTemplate from './state/CardTemplates'

const preloadNulls = (state) => {
    let nullProp = 'NULL-STACK'
    return {
        ...state,
        stacks: combineDenormalizedObjects(state.stacks, 
            listToDenormalized([{
                id: nullProp,
                cards: []
            }], StateTypes.Stack))
    }
}

const preloadDecks = (state) => {
    const deckId = generateKey(StateTypes.Stack)
    const discardId = generateKey(StateTypes.Stack)
    const cards = listToDenormalized(
        ['X', 'Y', 'X', 'Y', 'X', 'X', 'X', 'Y', 'X', 'X'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue + 'Card'].id })),
        StateTypes.Card
    )
    let decks = listToDenormalized([{
            id: deckId,
            cards: cards.allIds,
        }, {
            id: discardId,
            cards: []
        }], StateTypes.Stack)

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
    let stacks = listToDenormalized(
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
    const cards = listToDenormalized(
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