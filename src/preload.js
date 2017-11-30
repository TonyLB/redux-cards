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
        ['Fuel1', 'Asteroid', 'Bussard', 'Asteroid', 'Gas', 'Comet', 'Gas', 'Gas', 'EVAMining', 'Asteroid', 'Asteroid', 'Comet', 'Asteroid'].map(cardValue => 
            ({
                cardTemplate: CardTemplate[cardValue].id,
                uses: CardTemplate[cardValue].maxUses ? 0 : undefined,
                maxUses: CardTemplate[cardValue].maxUses ? CardTemplate[cardValue].maxUses : undefined,
            })),
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

const preloadTrack = (preloadCardTemplates, key) => (state) => {
    const deckId = generateKey(StateTypes.Stack)
    const cards = listToDenormalized(
        preloadCardTemplates.map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue].id })),
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
        hand: {
            ...state.hand,
            [key]: trackId
        },
        cards: combineDenormalizedObjects(state.cards, cards),
        tracks: combineDenormalizedObjects(state.tracks, tracks),
        stacks: combineDenormalizedObjects(state.stacks, decks)
    }        
}

const preloadDeployedEVA = (state) => {
    let filteredCard = listToDenormalized(
        ['EVAFuel'].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue].id })),
        StateTypes.Card
    )
    const filteredCardId = filteredCard.allIds[0]
    const deployedCard = Object.entries(state.cards.byId)
        .filter(([key, val]) => (val.cardTemplate === 'EVAMining'))
        .map(([key, val]) => (key))[0]
    filteredCard = {
        ...filteredCard,
        byId: {
            ...filteredCard,
            [filteredCardId]: {
                ...filteredCard.byId[filteredCardId],
                deployed: deployedCard
            }
        }
    }
    return {
        ...state,
        cards: combineDenormalizedObjects(state.cards, filteredCard),
        stacks: {
            ...state.stacks,
            byId: {
                ...state.stacks.byId,
                [state.tracks.byId[state.hand.equipmentTrack].deck]: {
                    ...(state.stacks.byId[state.tracks.byId[state.hand.equipmentTrack].deck]),
                    cards: [
                        ...(state.stacks.byId[state.tracks.byId[state.hand.equipmentTrack].deck].cards),
                        filteredCardId
                    ]
                }
            }
        }
    }
}

const preloadShortCuts = (state) => ({
    ...state,
    hand: {
        ...state.hand,
        shortCuts: {
            DISCARD: state.hand.discardId,
            DRAW: state.hand.drawId,
            EQUIPMENT: state.tracks.byId[state.hand.equipmentTrack].deck,
            SCIENCE: state.tracks.byId[state.hand.scienceTrack].deck
        }
    }
})

const preloadState = () => { 
    let loadFuncs = [
        preloadNulls,
        preloadRandoms,
        preloadHand,
        preloadDecks,
        preloadTrack(['EVAFuel', 'PlotIntercept'], 'equipmentTrack'),
        preloadTrack(['DesignCargoBay', 'DesignAsteroidBelt', 'DesignFuelTank'], 'scienceTrack'),
        preloadDeployedEVA,
        preloadShortCuts
    ]
    return loadFuncs.reduce((state, loadFunc) => ( loadFunc(state) ), {})
}

export default preloadState