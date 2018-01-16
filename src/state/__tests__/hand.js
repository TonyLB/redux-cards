import "babel-polyfill";
import { combinatoricExpansion, priceTotal, cardsToSpend, resourceTotals } from '../hand'
import reduce from '../../reducers/testApp'

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
            EQUIPMENT: 'TRACK5'
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

describe('store/state/hand/combinatoricExpansion', () => {

    it('should return single empty list when passed an empty list', () => {
        expect(combinatoricExpansion([])).toEqual([ [] ])
    })

    it('should return empty list and single-value list when passed a single value', () => {
        expect(combinatoricExpansion(['A'])).toEqual([ [], ['A'] ])
    })

    it('should return combinatoric expansion when passed several values', () => {
        expect(combinatoricExpansion(['A', 'B', 'C'])).toEqual([
            [],
            ['C'],
            ['B'],
            ['B', 'C'],
            ['A'],
            ['A', 'C'],
            ['A', 'B'],
            ['A', 'B', 'C']
        ])
    })

})

describe('store/state/hand/priceTotal', () => {

    it('should return a null object when passed an empty list', () => {
        expect(priceTotal([])).toEqual({})
    })

    it('should return the prices from a single card', () => {
        expect(priceTotal([ 
            { resources: { FUEL: 2, ORE: 1 } },
        ])).toEqual({ FUEL: 2, ORE: 1 })
    })

    it('should return the total prices from multiple cards', () => {
        expect(priceTotal([ 
            { resources: { FUEL: 2, ORE: 1 } },
            { resources: { ORE: 5 }}
        ])).toEqual({ FUEL: 2, ORE: 6 })
    })
})

describe('store/state/hand/cardsToSpend', () => {

    it('should return null for an empty hand', () => {
        const cards = cardsToSpend(emptyHand, { FUEL: 2 })
        expect(cards.length).toBe(0)
    })

    it('should return null when the price is not met', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Ore1', destination: 'STACK11'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 3 })
        expect(cards.length).toBe(0)
    })

    it('should return all cards when the price requires all cards exactly', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Ore1', destination: 'STACK11'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 2, ORE: 1 })
        expect(cards).toEqual([
            { id: 'CARD20', source: 'STACK10' },
            { id: 'CARD21', source: 'STACK11' }
        ])        
    })

    it('should return all cards when the price requires all cards, with excess', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Ore5', destination: 'STACK11'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 2, ORE: 4 })
        expect(cards).toEqual([
            { id: 'CARD20', source: 'STACK10' },
            { id: 'CARD21', source: 'STACK11' }
        ])
    })

    it('should return only fuel cards when only fuel is required', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Ore5', destination: 'STACK11'},
            { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK12'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 3 })
        expect(cards).toEqual([
            { id: 'CARD20', source: 'STACK10' },
            { id: 'CARD22', source: 'STACK12' }
        ])
    })

    it('should pick the precise match when only one precise match is available', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel5', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Fuel2', destination: 'STACK11'},
            { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK12'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 2 })
        expect(cards).toEqual([
            { id: 'CARD21', source: 'STACK11' }
        ])
    })

    it('should pick the precise match with most cards when more than one precise match is available', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel5', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Fuel2', destination: 'STACK11'},
            { id: 'CARD22', cardTemplate: 'Fuel1', destination: 'STACK12'},
            { id: 'CARD23', cardTemplate: 'Fuel1', destination: 'STACK13'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 2 })
        expect(cards).toEqual([
            { id: 'CARD22', source: 'STACK12' },
            { id: 'CARD23', source: 'STACK13' }
        ])
    })

    it('should pick the closest match', () => {
        const sparseHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel5', destination: 'STACK10'},
            { id: 'CARD21', cardTemplate: 'Fuel2', destination: 'STACK11'},
            { id: 'CARD22', cardTemplate: 'Fuel2', destination: 'STACK12'}
        ]})
        const cards = cardsToSpend(sparseHand, { FUEL: 3 })
        expect(cards).toEqual([
            { id: 'CARD21', source: 'STACK11' },
            { id: 'CARD22', source: 'STACK12' }
        ])
    })
    
})

describe('store/state/hand/resourceTotals', () => {

    it('should return empty objects when presented with empty hand and deck', () => {
        expect(resourceTotals(emptyHand)).toEqual({ hand: {}, allCards: {}})
    })

    it('should return empty objects when presented with cards with no resources', () => {
        const resourcelessHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'EVAMining1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'EVAMining1', destination: 'STACK3' },
            { id: 'CARD22', cardTemplate: 'EVAMining1', destination: 'STACK4' },
        ]})

        expect(resourceTotals(resourcelessHand)).toEqual({ hand: {}, allCards: {}})
    })

    it('should return zeroes in hand, and values in allCards, when all resource cards in decks', () => {
        const resourcelessHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'EVAMining1', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK3' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK4' },
        ]})

        expect(resourceTotals(resourcelessHand)).toEqual({ hand: { FUEL: 0, ORE: 0 }, allCards: { FUEL: 1, ORE: 1 }})
    })

    it('should return identical hand and allCards total when all resource cards in hand', () => {
        const resourcefulHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK11' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK12' },
            { id: 'CARD23', cardTemplate: 'EVAMining1', destination: 'STACK4'}
        ]})

        expect(resourceTotals(resourcefulHand)).toEqual({
            hand: { FUEL: 3, ORE: 1 },
            allCards: { FUEL: 3, ORE: 1 }
        })
    })

    it('should combine totals when resource cards are in both places', () => {
        const splitHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Fuel2', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel1', destination: 'STACK3' },
            { id: 'CARD22', cardTemplate: 'Ore1', destination: 'STACK3' },
            { id: 'CARD23', cardTemplate: 'EVAMining1', destination: 'STACK4'}
        ]})

        expect(resourceTotals(splitHand)).toEqual({
            hand: { FUEL: 2, ORE: 0 },
            allCards: { FUEL: 3, ORE: 1 }
        })
    })

    it('should ignore planete resources', () => {
        const planeteHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Asteroid', destination: 'STACK11' },
            { id: 'CARD22', cardTemplate: 'Comet', destination: 'STACK12' }
        ]})

        expect(resourceTotals(planeteHand)).toEqual({
            hand: { },
            allCards: {  }
        })
    })

    it('should correctly total cards held on an aggregator', () => {
        const splitHand = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD20', cardTemplate: 'Bussard3', destination: 'STACK10' },
            { id: 'CARD21', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD22', cardTemplate: 'Fuel5', destination: 'STACK10' },
            { id: 'CARD23', cardTemplate: 'Gas', destination: 'STACK10' },
            { id: 'CARD24', cardTemplate: 'Fuel1', destination: 'STACK3' },
            { id: 'CARD25', cardTemplate: 'Ore1', destination: 'STACK3' },
            { id: 'CARD26', cardTemplate: 'EVAMining1', destination: 'STACK4'}
        ]})

        expect(resourceTotals(splitHand)).toEqual({
            hand: { FUEL: 10, ORE: 0 },
            allCards: { FUEL: 11, ORE: 1 }
        })
    })
    
})
