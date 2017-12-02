const settings = (state = {}, action) => {
    switch(action.type) {
        case 'CHANGE_SETTINGS':
            return Object.assign(state, action.changes)
        default:
            return state
    }
}

export default settings
