import "babel-polyfill";
import { cardLocation } from '../card'
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

describe('store/state/card/cardLocation', () => {

    it('should return null string when passed an empty list', () => {
        expect(cardLocation(emptyHand, 'CARD1')).toEqual('')
    })

    it('should return stack name when card is in stack', () => {
        const cardPlaced = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD1', cardTemplate: 'Fuel1', destination: 'STACK10'}
        ]})
        expect(cardLocation(cardPlaced, 'CARD1')).toEqual('STACK10')
    })

    it('should return null string when card is different from one in stack', () => {
        const cardPlaced = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD1', cardTemplate: 'Fuel1', destination: 'STACK10'}
        ]})
        expect(cardLocation(cardPlaced, 'CARD2')).toEqual('')
    })

    it('should return stack name when card is in track', () => {
        const cardPlaced = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD1', cardTemplate: 'Fuel1', destination: 'TRACK5'}
        ]})
        expect(cardLocation(cardPlaced, 'CARD1')).toEqual('TRACK5')
    })

    it('should return null string when card is different from one in track', () => {
        const cardPlaced = reduce(emptyHand, { type: 'ADD_CARDS', cards: [
            { id: 'CARD1', cardTemplate: 'Fuel1', destination: 'TRACK5'}
        ]})
        expect(cardLocation(cardPlaced, 'CARD2')).toEqual('')
    })
    
})