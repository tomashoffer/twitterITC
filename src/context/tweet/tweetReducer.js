import {GET_TWEET, ADD_TWEET, DELETE_TWEET, EDIT_TWEET, ACTUAL_TWEET} from '../../types/types'

export default  (state, action) => {
    switch(action.type){
        case  GET_TWEET:
            return{
                ...state,
                tweets: action.payload
            }
        case  ADD_TWEET:
            return{
                tweets: action.payload, 
                ...state
            }
        default: 
                return state;
    }
}