import {GET_LOGIN, GET_SIGNUP}from '../../types/types'

export default (state, action) => {
    switch (action.type) {
 
        case GET_LOGIN:
        return {
            userLogIn: action.payload
        }
        case GET_SIGNUP:
        return {
            userSignUp: action.payload
        }
        default:
            return state;
    }
}