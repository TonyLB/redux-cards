import "babel-polyfill";
import timers from '../timers'
import { Reducer } from 'redux-testkit'

const StarWars = Date.parse("May 25, 1977 12:00:00")
const existingState = {
    byId: {
        TIMER1: {
            id: 'TIMER1',
            durationSpent: 0,
            durationRemaining: 1000
        },
        TIMER2: {
            id: 'TIMER2',
            durationSpent: 1000,
            durationRemaining: 9000
        }
    },
    allIds: [ 'TIMER1', 'TIMER2' ],
    lastTick: StarWars,
    nextTimeoutId: 5
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
            .toChangeInState({})
    })
    
    it('should update all durations on a TICK', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'TICK', time: StarWars+500 })
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationSpent: 500,
                        durationRemaining: 500
                    },
                    TIMER2: {
                        durationSpent: 1500,
                        durationRemaining: 8500
                    }
                },
                lastTick: StarWars + 500
            })
    })

    it('should update durations on a matching START_TIMER without duration', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER2' })
            .toChangeInState({
                byId: {
                    TIMER2: {
                        durationSpent: 0,
                        durationRemaining: 10000
                    }
                }
            })
    })

    it('should update durations on a matching START_TIMER without duration', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER2', duration: 5000 })
            .toChangeInState({
                byId: {
                    TIMER2: {
                        durationSpent: 0,
                        durationRemaining: 5000
                    }
                }
            })
    })
    
    it('should add timer on non-matching START_TIMER', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'START_TIMER', id: 'TIMER6', duration: 1000 })
            .toChangeInState({
                byId: {
                    TIMER6: {
                        id: 'TIMER6',
                        durationSpent: 0,
                        durationRemaining: 1000,
                    }
                },
                allIds: [ 'TIMER1', 'TIMER2', 'TIMER6' ]
            })
    })

    it('should correctly stop timer with no spent duration', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'STOP_TIMERS', timers: ['TIMER1']})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationSpent: null
                    }
                }
            })
    })

    it('should correctly stop timer with spent duration', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'STOP_TIMERS', timers: ['TIMER2']})
            .toChangeInState({
                byId: {
                    TIMER2: {
                        durationSpent: null,
                        durationRemaining: 10000
                    }
                }
            })
    })

    it('should not alter state when STOP_TIMERS provides an unknown timer', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({type: 'STOP_TIMERS', timers: ['TIMER5']})
            .toChangeInState({})
    })

    it('should not alter state when STOP_TIMERS provides a stopped timer', () => {
        const stoppedState = timers(existingState, {
            type: 'STOP_TIMERS',
            timers: ['TIMER2']
        })

        Reducer(timers)
            .withState(stoppedState)
            .expect({type: 'STOP_TIMERS', timers: ['TIMER2']})
            .toChangeInState({})
    })

    it('should not alter state when REPEAT_TIMERS provides an unknown timer', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER5']})
            .toChangeInState({})
    })

    it('should not alter state when REPEAT_TIMERS provides a non-expired timer', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER1']})
            .toChangeInState({})
    })

    it('should reset duration when REPEAT_TIMERS provides a precisely-expired timer', () => {
        const expiredState = timers(existingState, { type: 'TICK', time: StarWars+1000 })
        Reducer(timers)
            .withState(expiredState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER1']})
            .toChangeInState({
                byId: {
                    ['TIMER1']: {
                        durationSpent: 0,
                        durationRemaining: 1000
                    }
                }
            })
    })

    it('should reset duration and spent when REPEAT_TIMERS provides an over-expired timer', () => {
        const expiredState = timers(existingState, { type: 'TICK', time: StarWars+1200 })
        Reducer(timers)
            .withState(expiredState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER1']})
            .toChangeInState({
                byId: {
                    ['TIMER1']: {
                        durationSpent: 200,
                        durationRemaining: 800
                    }
                }
            })
    })

    it('should not reset a timer to more than just-expired state (even if it would have expired multiple times in the interim)', () =>{
        const expiredState = timers(existingState, { type: 'TICK', time: StarWars+3000 })
        Reducer(timers)
            .withState(expiredState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER1']})
            .toChangeInState({
                byId: {
                    ['TIMER1']: {
                        durationSpent: 1000,
                        durationRemaining: 0
                    }
                }
            })
        
    })

    it('should correctly reset multiple timers on a REPEAT_TIMERS', () => {
        const expiredState = timers(existingState, { type: 'TICK', time: StarWars+11000 })
        Reducer(timers)
            .withState(expiredState)
            .expect({ type: 'REPEAT_TIMERS', timers: ['TIMER1', 'TIMER2']})
            .toChangeInState({
                byId: {
                    ['TIMER1']: {
                        durationSpent: 1000,
                        durationRemaining: 0
                    },
                    ['TIMER2']: {
                        durationSpent: 2000,
                        durationRemaining: 8000
                    }
                }
            })        
    })
    
    it('should adjust duration longer on SET_TIMERS', () => {
        const forwardState = timers(existingState, { type: 'TICK', time: StarWars+500 })
        Reducer(timers)
            .withState(forwardState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', duration: 2000 }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationRemaining: 1500
                    }
                }
            })
    })

    it('should adjust duration shorter on SET_TIMERS', () => {
        const forwardState = timers(existingState, { type: 'TICK', time: StarWars+500 })
        Reducer(timers)
            .withState(forwardState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', duration: 500 }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationRemaining: 0
                    }
                }
            })
    })

    it('should adjust duration remaining shorter than zero on SET_TIMERS', () => {
        const forwardState = timers(existingState, { type: 'TICK', time: StarWars+800 })
        Reducer(timers)
            .withState(forwardState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', duration: 500 }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationRemaining: -300
                    }
                }
            })
    })

    it('should adjust repeating to true on SET_TIMERS', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', repeating: true }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        repeating: true
                    }
                }
            })
    })

    it('should adjust repeating to false on SET_TIMERS', () => {
        const repeatingState = timers(existingState, { 
            type: 'SET_TIMERS', timers: [{ id: 'TIMER1', repeating: true }]
        })
        Reducer(timers)
            .withState(repeatingState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', repeating: false }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        repeating: false
                    }
                }
            })
    })

    it('should not adjust repeating to false when not specified on SET_TIMERS', () => {
        const repeatingState = timers(existingState, { 
            type: 'SET_TIMERS', timers: [{ id: 'TIMER1', repeating: true }]
        })
        Reducer(timers)
            .withState(repeatingState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', duration: 500 }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        durationRemaining: 500
                    }
                }
            })
    })

    it('should assign execute when specified on SET_TIMERS', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'SET_TIMERS', timers: [{ id: 'TIMER1', execute: () => { console.log('Hi!') } }]})
            .toChangeInState({
                byId: {
                    TIMER1: {
                        execute: expect.any(Function)
                    }
                }
            })
    })
    
    it('should make no change on SET_TIMEOUT with null ID', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'SET_TIMEOUT' })
            .toChangeInState({})
    })

    it('should change nextTimeoutId on SET_TIMEOUT with ID', () => {
        Reducer(timers)
            .withState(existingState)
            .expect({ type: 'SET_TIMEOUT', timeoutId: 27 })
            .toChangeInState({
                nextTimeoutId: 27
            })
    })

})