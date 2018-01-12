import "babel-polyfill";
import settings from '../settings'
import { Reducer } from 'redux-testkit'

const existingState = {
    WIDGETS: true,
    GIMBALS: 'magenta'
}

describe('store/reducer/settings', () => {
    it('should have an initial state', () => {
        expect(settings()).toEqual({})
    })

    it('should not affect state', () => {
        Reducer(settings)
            .withState(existingState)
            .expect({ type: 'NOT_EXISTING'})
            .toChangeInState({})
    })

    it('should add a new setting', () => {
        Reducer(settings)
            .withState(existingState)
            .expect({
                type: 'CHANGE_SETTINGS',
                changes: {
                    FRAZZLE: 50,
                }
            })
            .toChangeInState({
                FRAZZLE: 50
            })
    })
    
    it('should add multiple settings', () => {
        Reducer(settings)
            .withState(existingState)
            .expect({
                type: 'CHANGE_SETTINGS',
                changes: {
                    FRAZZLE: 50,
                    DAZZLE: false
                }
            })
            .toChangeInState({
                FRAZZLE: 50,
                DAZZLE: false
            })
    })

    it('should override a single setting', () => {
        Reducer(settings)
        .withState(existingState)
        .expect({
            type: 'CHANGE_SETTINGS',
            changes: {
                WIDGETS: false
            }
        })
        .toChangeInState({
            WIDGETS: false
        })
    
    })

    it('should override multiple settings', () => {
        Reducer(settings)
        .withState(existingState)
        .expect({
            type: 'CHANGE_SETTINGS',
            changes: {
                WIDGETS: false,
                GIMBALS: 'fuschia'
            }
        })
        .toChangeInState({
            WIDGETS: false,
            GIMBALS: 'fuschia'
        })
    
    })

})