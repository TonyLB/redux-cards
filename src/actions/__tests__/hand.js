import "babel-polyfill";
import { Thunk } from 'redux-testkit'
import { condenseHand, shuffleIfNeeded, drawCard, checkPurchases, activatePurchase } from '../hand.js'
import reduce from '../../reducers/testApp'
import { lockStack } from '../stacks'

import { generateKey } from '../../reducers/keys.js'

jest.mock('../../reducers/keys.js')
jest.useFakeTimers()

const emptyHand = {
    cards: {
        byId: { },
        allIds: [ ]
    },
    stacks: {
        byId: {
            'STACK3': {
                id: 'STACK3',
                cards: []
            },
            'STACK4': {
                id: 'STACK4',
                cards: []
            },
            'STACK10': {
                id: 'STACK10',
                cards: []
            },
            'STACK11': {
                id: 'STACK11',
                cards: []
            },
            'STACK12': {
                id: 'STACK12',
                cards: []
            },
            'STACK13': {
                id: 'STACK13',
                cards: []
            }
        },
        allIds: ['STACK3', 'STACK4', 'STACK10', 'STACK11', 'STACK12', 'STACK13']
    },
    tracks: {
        byId: {
            'TRACK5': {
                id: 'TRACK5',
                cards: []
            }
        },
        allIds: ['TRACK5']
    },
    hand: {
        id: 'HAND1',
        shortCuts: {
            DISCARD: 'STACK3',
            DRAW: 'STACK4',
            EQUIPMENT: 'TRACK5',
            SCIENCE: 'TRACK5'
        },
        stacks: [
            'STACK10',
            'STACK11',
            'STACK12',
            'STACK13',
        ],
        drawId: 'STACK4',
        discardId: 'STACK3'
    }
}

describe('store/actions/hand/', () => {

    it('should dispatch no actions when hand is empty', () => {
        const dispatches = Thunk(condenseHand).withState(emptyHand).execute()

        expect(dispatches.length).toBe(0)
    })

    it('should close gaps made by empty stacks', () => {
        const gapHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Ore1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Ore1', destination: 'STACK13' }
        ]})

        const dispatches = Thunk(condenseHand).withState(gapHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SORT_HAND',
            stacks: ['STACK10', 'STACK13', 'STACK11', 'STACK12']
        })
    })

    it('should reorder stacks by priority', () => {
        const disorderedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Ore1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'FuelTank', destination: 'STACK11' }
        ]})

        const dispatches = Thunk(condenseHand).withState(disorderedHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SORT_HAND',
            stacks: ['STACK11', 'STACK10', 'STACK12', 'STACK13']
        })
    })

    it('should aggregate a single card into storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'FuelTank', destination: 'STACK11' }
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK10', destination: 'STACK11' }
            ],
            stacks: ['STACK11', 'STACK10', 'STACK12', 'STACK13']
        })
    })

    it('should aggregate multiple cards into storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'FuelTank', destination: 'STACK11' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK12' },
            { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK13' }
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK10', destination: 'STACK11' },
                { id: 'CARD23', source: 'STACK13', destination: 'STACK11' }
            ],
            stacks: ['STACK11', 'STACK12', 'STACK10', 'STACK13']
        })
    })

    it('should not aggregate into full storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD24', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD25', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD26', cardTemplate: 'Fuel1', destination: 'STACK11' },
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(0)
    })

    it('should aggregate into mixed storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard3', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK11' },
            { id: 'CARD23', cardTemplate: 'Gas', destination: 'STACK12' }
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD23', source: 'STACK12', destination: 'STACK10' }
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
    })

    it('should not aggregate into full mixed storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard3', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD24', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD25', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD26', cardTemplate: 'Fuel5', destination: 'STACK11' },
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(0)
    })

    it('should not aggregate into full mixed storage', () => {
        const unaggregatedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard3', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD24', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD25', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD26', cardTemplate: 'Fuel5', destination: 'STACK11' },
        ]})

        const dispatches = Thunk(condenseHand).withState(unaggregatedHand).execute()
        expect(dispatches.length).toBe(0)
    })

    it('should chain multiple aggregations', () => {
        const unchainedHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Fuel2', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD24', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD25', cardTemplate: 'FuelTank', destination: 'STACK11' },
            { id: 'CARD26', cardTemplate: 'Fuel1', destination: 'STACK11' },
            { id: 'CARD27', cardTemplate: 'Fuel2', destination: 'STACK11' },
            { id: 'CARD28', cardTemplate: 'Fuel2', destination: 'STACK11' },
            { id: 'CARD29', cardTemplate: 'Fuel5', destination: 'STACK11' },
            { id: 'CARD30', cardTemplate: 'Fuel5', destination: 'STACK11' },
            { id: 'CARD31', cardTemplate: 'Fuel1', destination: 'STACK12' },
        ]})

        const dispatches = Thunk(condenseHand).withState(unchainedHand).execute()
        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD26', source: 'STACK11', destination: 'STACK10' },
                { id: 'CARD31', source: 'STACK12', destination: 'STACK11' }
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
    })

    it('should not aggregate into a locked stack', () => {
        const lockedHand = reduce(
            reduce(emptyHand, lockStack('STACK10')),
            { type: 'ADD_CARDS', cards: [
                { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK10' },
                { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
                { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK11' }            
            ]})

        const dispatches = Thunk(condenseHand).withState(lockedHand).execute()
        expect(dispatches.length).toBe(0)
    })

    it('should not aggregate out of a locked stack', () => {
        const lockedHand = reduce(
            reduce(emptyHand, lockStack('STACK11')),
            { type: 'ADD_CARDS', cards: [
                { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK10' },
                { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
                { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK11' }            
            ]})

        const dispatches = Thunk(condenseHand).withState(lockedHand).execute()
        expect(dispatches.length).toBe(0)
    })    

    it('should aggregate past a locked stack', () => {
        const lockedHand = reduce(
            reduce(emptyHand, lockStack('STACK11')),
            { type: 'ADD_CARDS', cards: [
                { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK10' },
                { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
                { id: 'CARD22', cardTemplate: 'FuelTank', destination: 'STACK11' },
                { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK11' },
                { id: 'CARD24', cardTemplate: 'Fuel1', destination: 'STACK12' },
            ]})

        const dispatches = Thunk(condenseHand).withState(lockedHand).execute()
        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD24', source: 'STACK12', destination: 'STACK10' },
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
    })    
    
})

describe('store/actions/hand/shuffleIfNeeded', () => {

    it('should dispatch no actions when both decks are empty', () => {
        const dispatches = Thunk(shuffleIfNeeded).withState(emptyHand).execute()

        expect(dispatches.length).toBe(0)
    })

    it('should dispatch no actions when the draw deck has cards', () => {
        const drawableHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK4' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK3' }
        ]})

        const dispatches = Thunk(shuffleIfNeeded).withState(drawableHand).execute()

        expect(dispatches.length).toBe(0)
    })    

    it('should dispatch a shuffle action when needed', () => {
        const drawableHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK3' }
        ]})

        const dispatches = Thunk(shuffleIfNeeded).withState(drawableHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'COMBINE_STACKS',
            source: 'STACK3',
            destination: 'STACK4'
        })
    })    

})

describe('store/actions/hand/drawCard', () => {

    it('should dispatch only shuffleIfNeeded when draw deck is empty', () => {
        const dispatches = Thunk(drawCard).withState(emptyHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('shuffleIfNeeded')
    })

    it('should dispatch only shuffleIfNeeded when hand is full', () => {
        const fullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK4' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK11' },
            { id: 'CARD23', cardTemplate: 'Fuel2', destination: 'STACK12' },
            { id: 'CARD24', cardTemplate: 'Fuel1', destination: 'STACK13' }
        ]})

        const dispatches = Thunk(drawCard).withState(fullHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('shuffleIfNeeded')
    })

    it('should draw one card when hand is empty', () => {
        const fullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'FuelTank', destination: 'STACK4' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK4' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK4' },
            { id: 'CARD23', cardTemplate: 'Fuel2', destination: 'STACK4' },
            { id: 'CARD24', cardTemplate: 'Fuel1', destination: 'STACK4' }
        ]})

        const dispatches = Thunk(drawCard).withState(fullHand).execute()

        expect(dispatches.length).toBe(4)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [{ id: 'CARD20', source: 'STACK4', destination: 'STACK10' }],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
        expect(dispatches[1].isFunction()).toBe(true)
        expect(dispatches[1].getName()).toEqual('startTimer')
        expect(dispatches[2].isFunction()).toBe(true)
        expect(dispatches[2].getName()).toEqual('checkPurchases')
        expect(dispatches[3].isFunction()).toBe(true)
        expect(dispatches[3].getName()).toEqual('shuffleIfNeeded')
    })
    
})

describe('store/actions/hand/activatePurchase', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch nothing on an invalid stackId', () => {
        const dispatches = Thunk(activatePurchase).withState(emptyHand).execute('garbage')

        expect(dispatches.length).toBe(0)
    })
    
    it('should dispatch nothing on an empty stack', () => {
        const dispatches = Thunk(activatePurchase).withState(emptyHand).execute('STACK10')

        expect(dispatches.length).toBe(0)
    })

    it('should dispatch nothing when called on the wrong stack', () => {
        const fullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Gas', destination: 'STACK10' }
        ]})
        const dispatches = Thunk(activatePurchase).withState(fullAggregator).execute('STACK11')

        expect(dispatches.length).toBe(0)
    })

    it('should dispatch nothing if the price is not paid', () => {
        const halfFullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' }
        ]})
        const dispatches = Thunk(activatePurchase).withState(halfFullAggregator).execute('STACK10')

        expect(dispatches.length).toBe(0)
    })

    it('should purchase and discard, if no maxUses specified', () => {
        const fullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Gas', destination: 'STACK10' }
        ]})
        generateKey.mockReturnValueOnce('CARD23')
        const dispatches = Thunk(activatePurchase).withState(fullAggregator).execute('STACK10')

        expect(dispatches.length).toBe(6)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'ADD_CARDS',
            cards: [
                { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK10' }
            ]
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'UNLOCK_STACK',
            stackId: 'STACK10'
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'MARK_USE',
            cards: []
        })
        expect(dispatches[3].isPlainObject()).toBe(true)
        expect(dispatches[3].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK10', destination: 'STACK3' },
                { id: 'CARD21', source: 'STACK10', destination: 'STACK3' },
                { id: 'CARD22', source: 'STACK10', destination: 'STACK3' }
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
        expect(dispatches[4].isFunction()).toBe(true)
        expect(dispatches[4].getName()).toEqual('checkPurchases')
        expect(dispatches[5].isFunction()).toBe(true)
        expect(dispatches[5].getName()).toEqual('maybeRebootDrawCycle')
    })

    it('should purchase, mark, and discard, if maxUses specified', () => {
        const fullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'EVAMining1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Asteroid', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Asteroid', destination: 'STACK10' }
        ]})
        generateKey.mockReturnValueOnce('CARD23')
        const dispatches = Thunk(activatePurchase).withState(fullAggregator).execute('STACK10')

        expect(dispatches.length).toBe(6)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'ADD_CARDS',
            cards: [
                { id: 'CARD23', cardTemplate: 'Ore1', destination: 'STACK10' }
            ]
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'UNLOCK_STACK',
            stackId: 'STACK10'
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'MARK_USE',
            cards: ['CARD20']
        })
        expect(dispatches[3].isPlainObject()).toBe(true)
        expect(dispatches[3].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK10', destination: 'STACK3' },
                { id: 'CARD21', source: 'STACK10', destination: 'STACK3' },
                { id: 'CARD22', source: 'STACK10', destination: 'STACK3' }
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
        expect(dispatches[4].isFunction()).toBe(true)
        expect(dispatches[4].getName()).toEqual('checkPurchases')
        expect(dispatches[5].isFunction()).toBe(true)
        expect(dispatches[5].getName()).toEqual('maybeRebootDrawCycle')
    })

    it('should aggregate purchase into storage, if available', () => {
        const fullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD19', cardTemplate: 'FuelTank', destination: 'STACK10' },
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK11' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK11' },
            { id: 'CARD22', cardTemplate: 'Gas', destination: 'STACK11' }
        ]})
        generateKey.mockReturnValueOnce('CARD23')
        const dispatches = Thunk(activatePurchase).withState(fullAggregator).execute('STACK11')

        expect(dispatches.length).toBe(6)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'ADD_CARDS',
            cards: [
                { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK11' }
            ]
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'UNLOCK_STACK',
            stackId: 'STACK11'
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'MARK_USE',
            cards: []
        })
        expect(dispatches[3].isPlainObject()).toBe(true)
        expect(dispatches[3].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK11', destination: 'STACK3' },
                { id: 'CARD21', source: 'STACK11', destination: 'STACK3' },
                { id: 'CARD22', source: 'STACK11', destination: 'STACK3' },
                { id: 'CARD23', source: 'STACK11', destination: 'STACK10'}
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
        expect(dispatches[4].isFunction()).toBe(true)
        expect(dispatches[4].getName()).toEqual('checkPurchases')
        expect(dispatches[5].isFunction()).toBe(true)
        expect(dispatches[5].getName()).toEqual('maybeRebootDrawCycle')
    })

    it('should purchase from a multi-purchase card', () => {
        const fullAggregator = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD19', cardTemplate: 'Smelter1', destination: 'STACK10' },
            { id: 'CARD20', cardTemplate: 'Ore1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Ore1', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK10' }
        ]})
        generateKey.mockReturnValueOnce('CARD23')
        const dispatches = Thunk(activatePurchase).withState(fullAggregator).execute('STACK10')

        expect(dispatches.length).toBe(6)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'ADD_CARDS',
            cards: [
                { id: 'CARD23', cardTemplate: 'Ore2', destination: 'STACK10' }
            ]
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'UNLOCK_STACK',
            stackId: 'STACK10'
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'MARK_USE',
            cards: ['CARD20', 'CARD21', 'CARD22']
        })
        expect(dispatches[3].isPlainObject()).toBe(true)
        expect(dispatches[3].getAction()).toEqual({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD20', source: 'STACK10' },
                { id: 'CARD21', source: 'STACK10' },
                { id: 'CARD22', source: 'STACK10' }
            ],
            stacks: ['STACK10', 'STACK11', 'STACK12', 'STACK13']
        })
        expect(dispatches[4].isFunction()).toBe(true)
        expect(dispatches[4].getName()).toEqual('checkPurchases')
        expect(dispatches[5].isFunction()).toBe(true)
        expect(dispatches[5].getName()).toEqual('maybeRebootDrawCycle')
    })
    
})

describe('store/actions/hand/checkPurchases', () => {
    
    it('should dispatch nothing when the hand is empty', () => {
        const dispatches = Thunk(checkPurchases).withState(emptyHand).execute()

        expect(dispatches.length).toBe(0)
    })

    it('should dispatch nothing when there is no full aggregator', () => {
        const notFullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' }
        ]})

        const dispatches = Thunk(checkPurchases).withState(notFullHand).execute()

        expect(dispatches.length).toBe(0)
    })

    it('should queue purchase when there is a full aggregator', () => {
        const fullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Gas', destination: 'STACK10' }
        ]})

        const dispatches = Thunk(checkPurchases).withState(fullHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('queuePurchase')
    })

    it('should queue twice when there are two full aggregators', () => {
        const fullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'EVAMining1', destination: 'STACK11' },
            { id: 'CARD24', cardTemplate: 'Asteroid', destination: 'STACK11' },
            { id: 'CARD25', cardTemplate: 'Asteroid', destination: 'STACK11' }
        ]})

        const dispatches = Thunk(checkPurchases).withState(fullHand).execute()

        expect(dispatches.length).toBe(2)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('queuePurchase')
        expect(dispatches[1].isFunction()).toBe(true)
        expect(dispatches[1].getName()).toEqual('queuePurchase')
    })

    it('should queue once when there one full and one empty aggregator', () => {
        const halfFullHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'EVAMining1', destination: 'STACK11' },
            { id: 'CARD24', cardTemplate: 'Asteroid', destination: 'STACK11' },
            { id: 'CARD25', cardTemplate: 'Asteroid', destination: 'STACK11' }
        ]})

        const dispatches = Thunk(checkPurchases).withState(halfFullHand).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('queuePurchase')
    })
    
})