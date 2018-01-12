import "babel-polyfill";
import { nextTimers, nextDuration, expiredTimers } from '../timers'
import reducer from '../../reducers/testApp'

const StarWars = Date.parse("May 25, 1977 12:00:00")
const existingState = {
    timers: {
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
}

describe('store/state/timers/nextTimers', () => {

    it('should return empty list when passed an empty set of timers', () => {
        expect(nextTimers({ timers: { byId: {}, allIds: [], lastTick: StarWars, nextTimeoutId: 0 }})).toEqual([])
    })

    it('should return empty list when all timers are expired', () => {
        const expiredTimers = reducer(existingState, { type: 'TICK', time: StarWars+10000 })
        expect(nextTimers(expiredTimers)).toEqual([])
    })

    it('should return empty list when all timers are stopped', () => {
        const stoppedTimers = reducer(existingState, { type: 'STOP_TIMERS', timers: ['TIMER1', 'TIMER2']})
        expect(nextTimers(stoppedTimers)).toEqual([])
    })

    it('should return a list with the earliest element (if unique)', () => {
        expect(nextTimers(existingState)).toEqual(['TIMER1'])
    })

    it('should return a list with elements that are tied for first', () => {
        const tiedTimers = reducer(
            reducer(existingState, { type: 'START_TIMER', moment: StarWars, id: 'TIMER6', duration: 2000 }), 
            { type: 'SET_TIMERS', timers: [{ id: 'TIMER2', duration: 2000 }]}
        )
        expect(nextTimers(tiedTimers)).toEqual(['TIMER1', 'TIMER2'])
    })

    it('should return a list with only non-expired elements', () => {
        const partExpiredTimers = reducer(existingState, { type: 'TICK', time: StarWars+1000})
        expect(nextTimers(partExpiredTimers)).toEqual(['TIMER2'])
    })

})

describe('store/state/timers/nextDuration', () => {

    it('should return null when passed an empty set of timers', () => {
        expect(nextDuration({ timers: { byId: {}, allIds: [], lastTick: StarWars, nextTimeoutId: 0 }})).toBe(null)
    })

    it('should return null when all timers are expired', () => {
        const expiredTimers = reducer(existingState, { type: 'TICK', time: StarWars+10000 })
        expect(nextDuration(expiredTimers)).toBe(null)
    })

    it('should return the duration of the earliest element (if unique)', () => {
        expect(nextDuration(existingState)).toEqual(1000)
    })

    it('should return the common duration of elements that are tied for first', () => {
        const tiedTimers = reducer(
            reducer(existingState, { type: 'START_TIMER', id: 'TIMER6', duration: 2000 }), 
            { type: 'SET_TIMERS', timers: [{ id: 'TIMER2', duration: 2000 }]}
        )
        expect(nextDuration(tiedTimers)).toEqual(1000)
    })

    it('should return the duration of only non-expired elements', () => {
        const partExpiredTimers = reducer(existingState, { type: 'TICK', time: StarWars+1000})
        expect(nextDuration(partExpiredTimers)).toEqual(8000)
    })

})

describe('store/state/timers/expiredTimers', () => {

    it('should return empty list when passed an empty set of timers', () => {
        expect(expiredTimers({ timers: { byId: {}, allIds: [], lastTick: StarWars, nextTimeoutId: 0 }})).toEqual([])
    })

    it('should return whole list when all timers are expired', () => {
        const allTimers = reducer(existingState, { type: 'TICK', time: StarWars+10000 })
        expect(expiredTimers(allTimers)).toEqual(['TIMER1', 'TIMER2'])
    })

    it('should return a list with the earliest element (if unique)', () => {
        expect(expiredTimers(existingState)).toEqual([])
    })

    it('should return a list with only expired elements', () => {
        const partExpiredTimers = reducer(existingState, { type: 'TICK', time: StarWars+1000})
        expect(expiredTimers(partExpiredTimers)).toEqual(['TIMER1'])
    })

    it('should re-sort the list if expiries are out of list order', () => {
        const resortedTimers = reducer(
            reducer(existingState, { type: 'SET_TIMERS', timers: [{ id: 'TIMER2', duration: 1500 }] } ),
            { type: 'TICK', time: StarWars+1000 }
        )
        expect(expiredTimers(resortedTimers)).toEqual(['TIMER2', 'TIMER1'])
    })
    
})