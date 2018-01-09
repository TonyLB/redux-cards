import "babel-polyfill";
import { stacks, shuffleStacks } from '../stacks'
import { Reducer } from 'redux-testkit'
import CardTemplates from '../../state/CardTemplates'
import { lockStack, unlockStack } from '../../actions/stacks'

const initialState = {
    byId: {},
    allIds: []
}

const existingState = {
    byId: {
        STACK1: {
            id: 'STACK1',
            cards: ['CARD10', 'CARD12', 'CARD15']
        },
        STACK2: {
            id: 'STACK2',
            cards: ['CARD7', 'CARD8', 'CARD9']
        },
        STACK5: {
            id: 'STACK5',
            cards: []
        }
    },
    allIds: ['STACK1', 'STACK2', 'STACK5']
}

describe('store/reducer/stacks', () => {
    it('should have an initial state', () => {
        expect(stacks()).toEqual(initialState)
    })

    it('should not affect state', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({ type: 'NOT_EXISTING'})
            .toStayTheSame
    })

    it('should add a single card', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({ type: 'ADD_CARDS', cards: [{ id: 'CARD20', cardTemplate: 'Ore1', destination: 'STACK2' }]})
            .toChangeInState({
                byId: {
                    STACK2: {
                        cards: [...(existingState.byId['STACK2'].cards), 'CARD20']
                    }                    
                },
            })
    })

    it('should add multiple cards', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({ 
                type: 'ADD_CARDS', 
                cards: [
                    { id: 'CARD20', cardTemplate: 'Ore1', destination: 'STACK2' },
                    { id: 'CARD22', cardTemplate: 'CargoBay', destination: 'STACK5' },
                ]
            })
            .toChangeInState({
                byId: {
                    STACK2: {
                        cards: [...(existingState.byId['STACK2'].cards), 'CARD20']
                    },
                    STACK5: {
                        cards: [...(existingState.byId['STACK5'].cards), 'CARD22']
                    }                    
                }
            })
    })

    it('should remove a single card', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'STACK1', destination: null}
                ]
            })
            .toChangeInState({
                byId: {
                    STACK1: {
                        cards: ['CARD10', 'CARD15']
                    },
                }
            })
    })

    it('should remove multiple cards', () => {
        Reducer(stacks)
        .withState(existingState)
        .expect({
            type: 'MOVE_CARDS',
            cards: [
                { id: 'CARD12', source: 'STACK1', destination: null},
                { id: 'CARD15', source: 'STACK1', destination: null}
            ]
        })
        .toChangeInState({
            byId: {
                STACK1: {
                    cards: ['CARD10']
                },
            }
        })
    })

    it('should move a single card', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'STACK1', destination: 'STACK2'}
                ]
            })
            .toChangeInState({
                byId: {
                    STACK1: {
                        cards: ['CARD10', 'CARD15']
                    },
                    STACK2: {
                        cards: ['CARD7', 'CARD8', 'CARD9', 'CARD12']
                    }
                }
            })
    })

    it('should move multiple cards', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect({
                type: 'MOVE_CARDS',
                cards: [
                    { id: 'CARD12', source: 'STACK1', destination: 'STACK2'},
                    { id: 'CARD15', source: 'STACK1', destination: 'STACK5'}
                ]
            })
            .toChangeInState({
                byId: {
                    STACK1: {
                        cards: ['CARD10']
                    },
                    STACK2: {
                        cards: ['CARD7', 'CARD8', 'CARD9', 'CARD12']
                    },
                    STACK5: {
                        cards: ['CARD15']
                    },
                }
            })
    })

    it('should not change when combining from an empty stack without randoms', ()=> {
        expect(shuffleStacks(
            existingState, 
            {
                type: 'COMBINE_STACKS',
                source: 'STACK5',
                destination: 'STACK1'
            },
            [],
            [0, 0, 0]
        )).toEqual(existingState)
    })

    it('should shuffle destination stack when combining from an empty stack without randoms', ()=> {
        expect(shuffleStacks(
            existingState, 
            {
                type: 'COMBINE_STACKS',
                source: 'STACK5',
                destination: 'STACK1'
            },
            [],
            [0.6, 0.1, 0.9]
        )).toEqual({
            ...existingState,
            byId: {
                ...existingState.byId,
                STACK1: {
                    id: 'STACK1',
                    cards: ['CARD12', 'CARD10', 'CARD15']
                }
            }
        })
    })

    it('should combine two stacks and shuffle them', () => {
        expect(shuffleStacks(
            existingState, 
            {
                type: 'COMBINE_STACKS',
                source: 'STACK2',
                destination: 'STACK1'
            },
            ['CARD7', 'CARD8', 'CARD9'],
            [0.1, 0.9, 0.6, 0.1, 0.9, 0.6]
        )).toEqual({
            ...existingState,
            byId: {
                ...existingState.byId,
                STACK1: {
                    id: 'STACK1',
                    cards: ['CARD10', 'CARD9', 'CARD7', 'CARD12', 'CARD8', 'CARD15']
                },
                STACK2:{
                    id: 'STACK2',
                    cards: []
                },
            }
        })
    })

    it('should shuffle onto empty destination stack', ()=> {
        expect(shuffleStacks(
            existingState, 
            {
                type: 'COMBINE_STACKS',
                source: 'STACK1',
                destination: 'STACK5'
            },
            ['CARD10', 'CARD12', 'CARD15'],
            [0.6, 0.1, 0.9]
        )).toEqual({
            ...existingState,
            byId: {
                ...existingState.byId,
                STACK1: { 
                    id: 'STACK1', 
                    cards: []
                },
                STACK5: {
                    id: 'STACK5',
                    cards: ['CARD12', 'CARD10', 'CARD15']
                }
            }
        })
    })

    it('should lock a stack', () => {
        Reducer(stacks)
            .withState(existingState)
            .expect(lockStack('STACK1'))
            .toChangeInState({
                byId: {
                    STACK1: {
                        locked: true
                    }
                }
            })
    })

    it('should unlock a stack', () => {
        const lockedState = {
            ...existingState,
            byId: {
                ...existingState.byId,
                'STACK1': {
                    ...existingState.byId['STACK1'],
                    locked: true
                }
            }
        }

        Reducer(stacks)
            .withState(lockedState)
            .expect(unlockStack('STACK1'))
            .toChangeInState({
                byId: {
                    STACK1: {
                        locked: false
                    }
                }
            })
    })
    
})