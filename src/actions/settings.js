import { maybeRebootDrawCycle } from './hand'

const postChange = (dispatch, getState, changes) => {
    if (changes['AUTO-DRAW']) {
        dispatch(maybeRebootDrawCycle())
    }
}

export const changeSetting = (changes) => (dispatch, getState) => {
    dispatch({
        type: 'CHANGE_SETTINGS',
        changes
    })
    postChange(dispatch, getState, changes)
}