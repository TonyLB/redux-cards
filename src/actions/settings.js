import { setTimers } from './timers'

const postChange = (dispatch, getState, changes) => {
    if (changes['AUTO-DRAW']) {
        dispatch(setTimers([{ id: 'HARVEST-TIMER', repeating: true }]))
    }
}

export const changeSetting = (changes) => (dispatch, getState) => {
    dispatch({
        type: 'CHANGE_SETTINGS',
        changes
    })
    postChange(dispatch, getState, changes)
}