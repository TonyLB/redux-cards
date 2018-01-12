import "babel-polyfill";
import tracks from '../tracks'
import { Reducer } from 'redux-testkit'

const initialState = {
    byId: {},
    allIds: []
}

const existingState = {
    byId: {
        TRACK1: {
            id: 'TRACK1',
            cards: ['CARD10', 'CARD12', 'CARD15']
        },
        TRACK2: {
            id: 'TRACK2',
            cards: ['CARD7', 'CARD8', 'CARD9']
        },
        TRACK5: {
            id: 'TRACK5',
            cards: []
        }
    },
    allIds: ['TRACK1', 'TRACK2', 'TRACK5']
}

describe('store/reducer/tracks', () => {
    it('should have an initial state', () => {
        expect(tracks()).toEqual(initialState)
    })

    it('should not affect state', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({ type: 'NOT_EXISTING'})
            .toChangeInState({})
    })

    it('should add a single card', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({ type: 'ADD_CARDS', cards: [{ id: 'CARD20', cardTemplate: 'Ore1', destination: 'TRACK2' }]})
            .toChangeInState({
                byId: {
                    TRACK2: {
                        cards: [...(existingState.byId['TRACK2'].cards), 'CARD20']
                    }                    
                },
            })
    })

    it('should add multiple cards', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({ 
                type: 'ADD_CARDS', 
                cards: [
                    { id: 'CARD20', cardTemplate: 'Ore1', destination: 'TRACK2' },
                    { id: 'CARD22', cardTemplate: 'CargoBay', destination: 'TRACK5' },
                ]
            })
            .toChangeInState({
                byId: {
                    TRACK2: {
                        cards: [...(existingState.byId['TRACK2'].cards), 'CARD20']
                    },
                    TRACK5: {
                        cards: [...(existingState.byId['TRACK5'].cards), 'CARD22']
                    }                    
                }
            })
    })

    it('should remove a single card', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'TRACK1', destination: null}
                ]
            })
            .toChangeInState({
                byId: {
                    TRACK1: {
                        cards: ['CARD10', 'CARD15']
                    },
                }
            })
    })

    it('should remove multiple cards', () => {
        Reducer(tracks)
        .withState(existingState)
        .expect({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD12', source: 'TRACK1', destination: null},
                { id: 'CARD15', source: 'TRACK1', destination: null}
            ]
        })
        .toChangeInState({
            byId: {
                TRACK1: {
                    cards: ['CARD10']
                },
            }
        })
    })

    it('should move a single card', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'TRACK1', destination: 'TRACK2'}
                ]
            })
            .toChangeInState({
                byId: {
                    TRACK1: {
                        cards: ['CARD10', 'CARD15']
                    },
                    TRACK2: {
                        cards: ['CARD7', 'CARD8', 'CARD9', 'CARD12']
                    }
                }
            })
    })

    it('should move multiple cards', () => {
        Reducer(tracks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'TRACK1', destination: 'TRACK2'},
                    { id: 'CARD15', source: 'TRACK1', destination: 'TRACK5'}
                ]
            })
            .toChangeInState({
                byId: {
                    TRACK1: {
                        cards: ['CARD10']
                    },
                    TRACK2: {
                        cards: ['CARD7', 'CARD8', 'CARD9', 'CARD12']
                    },
                    TRACK5: {
                        cards: ['CARD15']
                    },
                }
            })
    })
    
})