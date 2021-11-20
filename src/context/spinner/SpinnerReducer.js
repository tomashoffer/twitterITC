import {SHOW_SPINNER, HIDE_SPINNER}from '../../types/types'

export default (state, action) => {
    switch (action.type) {
 
        case SHOW_SPINNER:
        return {
            spinner: action.payload
        }
        case HIDE_SPINNER:
        return {
            spinner: null
        }
        default:
            return state;
    }
}