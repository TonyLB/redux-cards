import "babel-polyfill";
import cards from '../cards'
import { Reducer } from 'redux-testkit'
import CardTemplates from '../../state/CardTemplates'

const initialState = {
    byId: {},
    allIds: []
}

const existingState = {
    byId: {
        CARD1: {
            id: 'CARD1',
            cardTemplate: 'Fuel1',
            maxUses: 1,
            uses: 1
        },
        CARD2: {
            id: 'CARD2',
            cardTemplate: 'EVAFuel1',
            deployed: 'CARD5',
        },
        CARD5: {
            id: 'CARD5',
            cardTemplate: 'EVAMining1',
            uses: 3,
            maxUses: 3
        }
    },
    allIds: ['CARD1', 'CARD2', 'CARD5']
}

describe('store/reducer/cards', () => {
    it('should have an initial state', () => {
        expect(cards()).toEqual(initialState)
    })

    it('should not affect state', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ type: 'NOT_EXISTING'})
            .toChangeInState({})
    })

    it('should add a single card', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ type: 'ADD_CARDS', cards: [{ id: 'CARD10', cardTemplate: 'Ore1' }]})
            .toChangeInState({
                byId: {
                    CARD10: {
                        id: 'CARD10',
                        cardTemplate: 'Ore1',
                        maxUses: 1,
                        uses: 1
                    }                    
                },
                allIds: [ ...existingState.allIds, 'CARD10' ]
            })
    })

    it('should add multiple cards', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'ADD_CARDS', 
                cards: [
                    { id: 'CARD10', cardTemplate: 'Ore1' },
                    { id: 'CARD12', cardTemplate: 'CargoBay' },
                ]
            })
            .toChangeInState({
                byId: {
                    CARD10: {
                        id: 'CARD10',
                        cardTemplate: 'Ore1',
                        maxUses: 1,
                        uses: 1
                    },
                    CARD12: {
                        id: 'CARD12',
                        cardTemplate: 'CargoBay',
                    }                    
                },
                allIds: [ ...existingState.allIds, 'CARD10', 'CARD12' ]
            })
    })

    it('should remove a single card', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD2', source: 'STACK20', destination: null}
                ]
            })
            .toReturnState({
                byId: {
                    CARD1: {
                        id: 'CARD1',
                        cardTemplate: 'Fuel1',
                        maxUses: 1,
                        uses: 1
                    },
                    CARD5: {
                        id: 'CARD5',
                        cardTemplate: 'EVAMining1',
                        uses: 3,
                        maxUses: 3
                    }
                },
                allIds: ['CARD1', 'CARD5']                            
            })
    })

    it('should remove multiple cards', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD1', source: 'STACK25', destination: null },
                    { id: 'CARD2', source: 'STACK20', destination: null },
                    { id: 'CARD5', source: 'STACK25', destination: 'STACK20' }
                ]
            })
            .toReturnState({
                byId: {
                    CARD5: {
                        id: 'CARD5',
                        cardTemplate: 'EVAMining1',
                        uses: 3,
                        maxUses: 3
                    }
                },
                allIds: ['CARD5']
            })
    })

    it('should update deploy on removal of deployed card', () => {
        Reducer(cards)
        .withState(existingState)
        .expect({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD5', source: 'STACK25', destination: null }
            ]
        })
        .toReturnState({
            byId: {
                CARD1: {
                    id: 'CARD1',
                    cardTemplate: 'Fuel1',
                    maxUses: 1,
                    uses: 1
                },
                CARD2: {
                    id: 'CARD2',
                    cardTemplate: 'EVAFuel1'
                },
            },
            allIds: ['CARD1', 'CARD2']
        })
    })
    
    it('should not mark use of an unusable card', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'MARK_USE', 
                cards: ['CARD2']
            })
            .toChangeInState({})
    })
            
    it('should mark use of a usable card', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'MARK_USE', 
                cards: ['CARD5']
            })
            .toChangeInState({
                byId: {
                    CARD5: {
                        uses: 2
                    },
                }
            })    
    })

    it('should mark use of multiple cards', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'MARK_USE', 
                cards: ['CARD1', 'CARD5']
            })
            .toChangeInState({
                byId: {
                    CARD1: {
                        uses: 0
                    },
                    CARD5: {
                        uses: 2
                    },
                }
            })    
    })

    it('should replace a single card', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'REPLACE_CARDS',
                cardMap: {
                    'Fuel1': 'Fuel2'
                }
            })
            .toChangeInState({
                byId: {
                    CARD1: {
                        cardTemplate: 'Fuel2'
                    },
                }
            })    
    })

    it('should replace multiple cards', () => {
        Reducer(cards)
            .withState(existingState)
            .expect({ 
                type: 'REPLACE_CARDS',
                cardMap: {
                    'Fuel1': 'Fuel2',
                    'EVAMining1': 'EVAMining2'
                }
            })
            .toChangeInState({
                byId: {
                    CARD1: {
                        cardTemplate: 'Fuel2'
                    },
                    CARD5: {
                        cardTemplate: 'EVAMining2'
                    }
                }
            })    
    })
    
})