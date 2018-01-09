import { generateKey } from './reducers/keys'
import { StateTypes, listToDenormalized, combineDenormalizedObjects } from './state'
import CardTemplate from './state/CardTemplates'
import { clearTimer } from './actions'
import { drawCard } from './actions/hand'

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
        ['Fuel1', 'Asteroid', 'Bussard1', 'Gas', 'Comet', 'Gas', 'EVAMining1', 'Asteroid', 'Gas', 'Asteroid'].map(cardValue => 
            ({
                cardTemplate: CardTemplate[cardValue].id,
                uses: CardTemplate[cardValue].maxUses ? CardTemplate[cardValue].maxUses : undefined,
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
    const timerId = 'HARVEST-TIMER'
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
                    duration: 2500,
                    execute: (dispatch, getState) => {
                        dispatch(clearTimer('HARVEST-TIMER'))
                        if (getState().settings['AUTO-DRAW']) {
                            dispatch(drawCard())                            
                        }
                    }
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
            ({ 
                cardTemplate: CardTemplate[cardValue].id,
                uses: CardTemplate[cardValue].maxUses ? CardTemplate[cardValue].maxUses : undefined,
                maxUses: CardTemplate[cardValue].maxUses ? CardTemplate[cardValue].maxUses : undefined
            })),
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

const preloadDeployed = (source, target) => (state) => {
    let filteredCard = listToDenormalized(
        [source].map(cardValue => 
            ({ cardTemplate: CardTemplate[cardValue].id })),
        StateTypes.Card
    )
    const filteredCardId = filteredCard.allIds[0]
    const deployedCard = Object.entries(state.cards.byId)
        .filter(([key, val]) => (val.cardTemplate === target))
        .map(([key, val]) => (key))[0]
    filteredCard = {
        ...filteredCard,
        byId: {
            ...filteredCard.byId,
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

const preloadSettings = (state) => ({
    ...state,
    settings: {

    }
})

const preloadState = () => { 
    let loadFuncs = [
        preloadNulls,
        preloadRandoms,
        preloadHand,
        preloadDecks,
        preloadTrack([
            'PlotIntercept1', 
            'EVAFuel1', 
            'DeploySkimmers1', 
            'TargetProbe1', 
            'UpgradeBussard1', 
            'UpgradeDrive1', 
            'UpgradeEVA1', 
            'AutoDraw',
            'DeployLaboratory1',
            'UpgradeSensor1',
            'DeploySmelter1',
            'UpgradeProbe1', 
            'FindDeposit1',
            'DesignAsteroidBelt'
        ], 'equipmentTrack'),
        preloadTrack([], 'scienceTrack'),
        preloadDeployed('EVAFuel1', 'EVAMining1'),
        preloadDeployed('DeployBussard1', 'Bussard1'),
        preloadShortCuts,
        preloadSettings
    ]
    return loadFuncs.reduce((state, loadFunc) => ( loadFunc(state) ), {})
}

export default preloadState