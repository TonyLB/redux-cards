import "babel-polyfill";
import { Thunk } from 'redux-testkit'
import { advanceTrack } from '../track.js'
import reduce from '../../reducers/testApp'
import { addCard } from "../index";

const emptyTrack = {
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
        },
        allIds: ['STACK3']
    },
    tracks: {
        byId: {
            'TRACK5': {
                id: 'TRACK5',
                cards: [],
                deck: 'STACK3',
                trackSize: 2
            }
        },
        allIds: ['TRACK5']
    }
}

describe('store/actions/track/advanceTrack', () => {

    it('should not dispatch anything when whole track is empty', () => {
        const dispatches = Thunk(advanceTrack).withState(emptyTrack).execute('TRACK5')

        expect(dispatches.length).toBe(0)
    })

    it('should not dispatch anything when whole track is empty', () => {
        const populatedTrack = reduce(emptyTrack, {
            type: 'ADD_CARDS', cards: [{
                id: 'CARD10', cardTemplate: 'Fuel1', destination: 'TRACK5'
            }]
        })
        const dispatches = Thunk(advanceTrack).withState(populatedTrack).execute('TRACK5')

        expect(dispatches.length).toBe(0)
    })

    it('should draw a card when available', () => {
        const populatedTrack = reduce(emptyTrack, {
            type: 'ADD_CARDS', cards: [
                { id: 'CARD10', cardTemplate: 'Fuel1', destination: 'TRACK5' },
                { id: 'CARD11', cardTemplate: 'Fuel1', destination: 'STACK3' }
            ]
        })
        const dispatches = Thunk(advanceTrack).withState(populatedTrack).execute('TRACK5')

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS', 
            cards: [
                { id: 'CARD11', source: 'STACK3', destination: 'TRACK5' }
            ],
            stacks: null
        })
    })

    it('should discard when track is full', () => {
        const populatedTrack = reduce(emptyTrack, {
            type: 'ADD_CARDS', cards: [
                { id: 'CARD10', cardTemplate: 'Fuel1', destination: 'TRACK5' },
                { id: 'CARD11', cardTemplate: 'Fuel1', destination: 'TRACK5' },
                { id: 'CARD12', cardTemplate: 'Fuel1', destination: 'STACK3' }
            ]
        })
        const dispatches = Thunk(advanceTrack).withState(populatedTrack).execute('TRACK5')

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS', 
            cards: [
                { id: 'CARD10', source: 'TRACK5', destination: 'STACK3' },
                { id: 'CARD12', source: 'STACK3', destination: 'TRACK5' }
            ],
            stacks: null
        })
    })

    it('should loop when track is full but deck is empty', () => {
        const populatedTrack = reduce(emptyTrack, {
            type: 'ADD_CARDS', cards: [
                { id: 'CARD10', cardTemplate: 'Fuel1', destination: 'TRACK5' },
                { id: 'CARD11', cardTemplate: 'Fuel1', destination: 'TRACK5' },
            ]
        })
        const dispatches = Thunk(advanceTrack).withState(populatedTrack).execute('TRACK5')

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'MOVE_CARDS', 
            cards: [
                { id: 'CARD10', source: 'TRACK5', destination: 'TRACK5' },
            ],
            stacks: null
        })
    })
    
})