import "babel-polyfill";
import hand from '../hand'
import { Reducer } from 'redux-testkit'

const StarWars = Date.parse("May 25, 1977")
const Empire = Date.parse("June 20, 1980")
const existingState = {
    id: 'HAND1', 
    stacks: ['STACK1', 'STACK2', 'STACK3'],
    timerId: 'TIMER17',
    timerStarted: StarWars,
    drawDeck: 'NULL-STACK',
    discardDeck: 'NULL-STACK'
}

describe('store/reducer/hand', () => {
    it('should have an initial state', () => {
        expect(hand()).toEqual({ 
            id: 'TEST', 
            stacks: [],
            timerId: 'NULL-TIMER',
            timerStarted: StarWars,
            drawDeck: 'NULL-STACK',
            discardDeck: 'NULL-STACK'
        })
    })

    it('should not alter state', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'NOT_SERVICED'})
            .toChangeInState({})
    })

    it('should not alter state on no stack value for SORT_HAND', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'SORT_HAND' })
            .toChangeInState({})
    })

    it('should not alter state on no stack value for MOVE_CARD', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'MOVE_CARDS' })
            .toChangeInState({})
    })

    it('should reorder stacks for SORT_HAND', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'SORT_HAND', stacks: ['STACK3', 'STACK1', 'STACK2']})
            .toChangeInState({
                stacks: ['STACK3', 'STACK1', 'STACK2']
            })
    })

    it('should reorder stacks for MOVE_CARDS', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'MOVE_CARDS', stacks: ['STACK3', 'STACK1', 'STACK2']})
            .toChangeInState({
                stacks: ['STACK3', 'STACK1', 'STACK2']
            })
    })

    it('should not update on non-matching START_TIMER', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({ type: 'START_TIMER', id: 'TIMER23', duration: 10000000, startTime: Empire})
            .toChangeInState({})
    })
    
    it('should update timerStarted on matching START_TIMER', () => {
        Reducer(hand)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER17', duration: 10000000, startTime: Empire })
            .toChangeInState({
                timerStarted: Empire
            })
    })
})