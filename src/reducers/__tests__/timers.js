import "babel-polyfill";
import timers from '../timers'
import { Reducer } from 'redux-testkit'

const StarWars = Date.parse("May 25, 1977")
const Empire = Date.parse("June 20, 1980")
const existingState = {
    byId: {
        TIMER1: {
            id: 'TIMER1',
            timeoutId: 0,
            startTime: StarWars,
            duration: 20000000
        },
        TIMER2: {
            id: 'TIMER2',
            timeoutId: 1,
            startTime: Empire,
            duration: 10000000
        }
    }
}

describe('store/reducer/timers', () => {
    it('should have an initial state', () => {
        expect(timers()).toEqual({ 
            byId: {},
            allIds: []
        })
    })

    it('should not alter state', () => {
        Reducer(timers)
            .expect({ type: 'NOT_SERVICED'})
            .toStayTheSame
    })
    
    it('should update timerStarted on matching START_TIMER', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER1', startTime: Empire, timeoutId: 5 })
            .toChangeInState({
                byId: {
                    TIMER1: {
                        startTime: Empire,
                        timeoutId: 5        
                    }
                }
            })
    })

    it('should add timerStarted on non-matching START_TIMER', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER6', startTime: Empire, timeoutId: 5, duration: 10000000 })
            .toChangeInState({
                byId: {
                    TIMER6: {
                        startTime: Empire,
                        timeoutId: 5,
                        duration: 10000000
                    }
                }
            })
    })

    it('should adjust duration on SET_TIMERS', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', duration: 15000000 }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        duration: 15000000
                    }
                }
            })
    })

    it('should clear timeoutId on CLEAR_TIMER', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'CLEAR_TIMER', id: 'TIMER1' })
            .toChangeInState({
                byId: {
                    TIMER1: {
                        timeoutId: null
                    }
                }
            })
    })

})